import type { Input, LatLon, ObstacleInput } from "../../optimizer/types";

type GeoJsonPosition = [number, number]; // [lon, lat]

type GeoJsonPolygon = GeoJsonPosition[][];

type GeoJsonMultiPolygon = GeoJsonPosition[][][];

type GeoJsonFeature = {
  type: "Feature";
  id?: string;
  properties?: Record<string, unknown>;
  geometry:
    | {
        type: "Polygon";
        coordinates: GeoJsonPolygon;
      }
    | {
        type: "MultiPolygon";
        coordinates: GeoJsonMultiPolygon;
      }
    | {
        type: string;
        coordinates: unknown;
      };
};

export type GeoJsonFeatureCollection = {
  type: "FeatureCollection";
  features: GeoJsonFeature[];
};

type ConvertOptions = {
  origin: LatLon & { height: number };
  destination: LatLon & { height: number };
  floor: number;
  ceiling: number;
  defaultHeight?: number;
  metersPerLevel?: number;
  maxObstacles?: number;

  // Removes consecutive polygon vertices closer than this distance.
  // Try 2, 3, 5, or 8 depending on how much simplification you want.
  minVertexDistanceMeters?: number;
};

export function geoJsonBuildingsToInput(
  geoJson: GeoJsonFeatureCollection,
  options: ConvertOptions,
): Input {
  const obstacles: ObstacleInput[] = [];

  let totalRawVertices = 0;
  let totalPrunedVertices = 0;

  for (const feature of geoJson.features) {
    if (!isBuildingFeature(feature)) {
      continue;
    }

    const height = getBuildingHeightMeters(
      feature.properties ?? {},
      options.defaultHeight ?? 12,
      options.metersPerLevel ?? 3,
    );

    const polygons = extractPolygons(feature);

    for (const polygon of polygons) {
      if (
        options.maxObstacles !== undefined &&
        obstacles.length >= options.maxObstacles
      ) {
        break;
      }

      const outerRing = polygon[0];

      if (!outerRing || outerRing.length < 3) {
        continue;
      }

      const rawPoints = geoJsonRingToLatLonPoints(outerRing);

      const points = pruneCloseVertices(
        rawPoints,
        options.minVertexDistanceMeters ?? 2,
      );

      if (points.length < 3) {
        continue;
      }

      totalRawVertices += rawPoints.length;
      totalPrunedVertices += points.length;

      obstacles.push({
        id: getObstacleId(feature, obstacles.length),
        kind: "polygon",
        height,
        points,
      });
    }

    if (
      options.maxObstacles !== undefined &&
      obstacles.length >= options.maxObstacles
    ) {
      break;
    }
  }

  console.log("GeoJSON building import:", {
    obstacleCount: obstacles.length,
    totalRawVertices,
    totalPrunedVertices,
    removedVertices: totalRawVertices - totalPrunedVertices,
  });

  return {
    origin: options.origin,
    destination: options.destination,
    floor: options.floor,
    ceiling: options.ceiling,
    obstacles,
  };
}

function isBuildingFeature(feature: GeoJsonFeature): boolean {
  return feature.properties?.building !== undefined;
}

function extractPolygons(feature: GeoJsonFeature): GeoJsonPolygon[] {
  if (feature.geometry.type === "Polygon") {
    return [feature.geometry.coordinates as GeoJsonPolygon];
  }

  if (feature.geometry.type === "MultiPolygon") {
    return feature.geometry.coordinates as GeoJsonMultiPolygon;
  }

  return [];
}

function geoJsonRingToLatLonPoints(ring: GeoJsonPosition[]): LatLon[] {
  const points: LatLon[] = [];

  for (const coordinate of ring) {
    const [lon, lat] = coordinate;

    points.push({
      lat,
      lon,
    });
  }

  // GeoJSON rings usually repeat the first point at the end.
  // Your planner does not need that duplicate closing point.
  if (points.length > 1) {
    const first = points[0];
    const last = points[points.length - 1];

    if (first.lat === last.lat && first.lon === last.lon) {
      points.pop();
    }
  }

  return points;
}

function pruneCloseVertices(
  points: LatLon[],
  minDistanceMeters: number,
): LatLon[] {
  if (points.length <= 3) {
    return points;
  }

  const pruned: LatLon[] = [points[0]];

  for (let i = 1; i < points.length; i++) {
    const previous = pruned[pruned.length - 1];
    const current = points[i];

    const distance = distanceLatLonMeters(previous, current);

    if (distance >= minDistanceMeters) {
      pruned.push(current);
    }
  }

  // Since the ring is unclosed now, also check if the final vertex
  // is too close to the first vertex.
  if (pruned.length > 3) {
    const first = pruned[0];
    const last = pruned[pruned.length - 1];

    if (distanceLatLonMeters(first, last) < minDistanceMeters) {
      pruned.pop();
    }
  }

  // If pruning somehow destroys the polygon, keep the original.
  if (pruned.length < 3) {
    return points;
  }

  return pruned;
}

function distanceLatLonMeters(a: LatLon, b: LatLon): number {
  const metersPerDegreeLat = 111_320;
  const averageLatRadians = (((a.lat + b.lat) / 2) * Math.PI) / 180;
  const metersPerDegreeLon = metersPerDegreeLat * Math.cos(averageLatRadians);

  const dx = (b.lon - a.lon) * metersPerDegreeLon;
  const dy = (b.lat - a.lat) * metersPerDegreeLat;

  return Math.sqrt(dx * dx + dy * dy);
}

function getBuildingHeightMeters(
  properties: Record<string, unknown>,
  defaultHeight: number,
  metersPerLevel: number,
): number {
  const height = parseNumber(properties.height);

  if (height !== null) {
    return height;
  }

  const levels = parseNumber(properties["building:levels"]);

  if (levels !== null) {
    return levels * metersPerLevel;
  }

  return defaultHeight;
}

function parseNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value !== "string") {
    return null;
  }

  // Handles values like "29", "90.9", or possibly "29 m".
  const match = value.match(/-?\d+(\.\d+)?/);

  if (!match) {
    return null;
  }

  const parsed = Number(match[0]);

  return Number.isFinite(parsed) ? parsed : null;
}

function getObstacleId(feature: GeoJsonFeature, index: number): string {
  if (feature.id) {
    return feature.id;
  }

  const osmId = feature.properties?.["@id"];

  if (typeof osmId === "string") {
    return osmId;
  }

  return `GEO${(index + 1).toString().padStart(4, "0")}`;
}
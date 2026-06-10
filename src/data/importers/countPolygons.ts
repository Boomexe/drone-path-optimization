type GeoJsonFeatureCollectionLike = {
  features: {
    geometry?: {
      type?: string;
      coordinates?: unknown;
    };
  }[];
};

export function countGeoJsonPolygons(
  geoJson: GeoJsonFeatureCollectionLike,
): {
  features: number;
  polygonFeatures: number;
  multiPolygonFeatures: number;
  totalPolygons: number;
} {
  let polygonFeatures = 0;
  let multiPolygonFeatures = 0;
  let totalPolygons = 0;

  for (const feature of geoJson.features) {
    const geometry = feature.geometry;

    if (!geometry) continue;

    if (geometry.type === "Polygon") {
      polygonFeatures++;
      totalPolygons++;
      continue;
    }

    if (geometry.type === "MultiPolygon") {
      multiPolygonFeatures++;

      if (Array.isArray(geometry.coordinates)) {
        totalPolygons += geometry.coordinates.length;
      }
    }
  }

  return {
    features: geoJson.features.length,
    polygonFeatures,
    multiPolygonFeatures,
    totalPolygons,
  };
}
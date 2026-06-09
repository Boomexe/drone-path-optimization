import type { LatLon, Pos2, Pos3 } from "./types";

const METERS_PER_DEGREE_LAT = 111_320;

export function latLonToPos2(pos: LatLon, origin: LatLon): Pos2 {
    const metersPerDegreeLon = METERS_PER_DEGREE_LAT * Math.cos(origin.lat * Math.PI / 180);

    return {
        x: (pos.lon - origin.lon) * metersPerDegreeLon,
        y: (pos.lat - origin.lat) * METERS_PER_DEGREE_LAT,
    };
}

export function pos2ToLatLon(pos: Pos2, origin: LatLon): LatLon {
    const metersPerDegreeLon = METERS_PER_DEGREE_LAT * Math.cos(origin.lat * Math.PI / 180);

    return {
        lat: origin.lat + pos.y / METERS_PER_DEGREE_LAT,
        lon: origin.lon + pos.x / metersPerDegreeLon,
    };
}

export function dist2D(a: Pos2, b: Pos2): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function dist2DSquared(a: Pos2, b: Pos2): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}

export function dist3D(a: Pos3, b: Pos3): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export function dist3DSquared(a: Pos3, b: Pos3): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return dx * dx + dy * dy + dz * dz;
}

export function pos2WithHeight(pos2: Pos2, height: number): Pos3 {
  return {
    ...pos2,
    z: height,
  };
}
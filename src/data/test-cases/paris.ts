import geoJsonData from "../geojson/paris.json";
import {
  geoJsonBuildingsToInput,
  type GeoJsonFeatureCollection,
} from "../importers/geoJsonBuildingsToInput";
import { countGeoJsonPolygons } from "../importers/countPolygons";

const geoJson = geoJsonData as unknown as GeoJsonFeatureCollection;

console.log("GeoJSON polygon count:", countGeoJsonPolygons(geoJson));

//2.3600933,
//48.8580583

export const parisInput = geoJsonBuildingsToInput(geoJson, {
  origin: {
    lat: 48.85462,
    lon: 2.3591,
    height: 0,
  },

  destination: {
    lat: 48.8592,
    lon: 2.3566,
    height: 0,
  },

  floor: 0,
  ceiling: 120,

  defaultHeight: 12,
  metersPerLevel: 3,
  maxObstacles: 200,

  minVertexDistanceMeters: 40,
});
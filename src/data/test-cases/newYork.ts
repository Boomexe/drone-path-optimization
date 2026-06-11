import geoJsonData from "../geojson/newYork.json";
import {
  geoJsonBuildingsToInput,
  type GeoJsonFeatureCollection,
} from "../importers/geoJsonBuildingsToInput";
import { countGeoJsonPolygons } from "../importers/countPolygons";

const geoJson = geoJsonData as unknown as GeoJsonFeatureCollection;

console.log("GeoJSON polygon count:", countGeoJsonPolygons(geoJson));

export const newYorkInput = geoJsonBuildingsToInput(geoJson, {
  origin: {
    lat: 40.703,
    lon: -74.018,
    height: 0,
  },

  destination: {
    lat: 40.711,
    lon: -74.008,
    height: 0,
  },

  floor: 0,
  ceiling: 120,

  defaultHeight: 100,
  metersPerLevel: 3,
  // maxObstacles: 380,

  minVertexDistanceMeters: 10,
});
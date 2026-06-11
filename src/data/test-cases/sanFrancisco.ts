import geoJsonData from "../geojson/sanFran.json";
import {
  geoJsonBuildingsToInput,
  type GeoJsonFeatureCollection,
} from "../importers/geoJsonBuildingsToInput";
import { countGeoJsonPolygons } from "../importers/countPolygons";

const geoJson = geoJsonData as unknown as GeoJsonFeatureCollection;

console.log("GeoJSON polygon count:", countGeoJsonPolygons(geoJson));

export const sanFranciscoInput = geoJsonBuildingsToInput(geoJson, {
  origin: {
    lat: 37.7899,
    lon: -122.4149,
    height: 0,
  },

  destination: {
    lat: 37.8,
    lon: -122.4061,
    height: 0,
  },

  floor: 0,
  ceiling: 120,

  defaultHeight: 30,
  metersPerLevel: 3,
  maxObstacles: 360,

  minVertexDistanceMeters: 3,
});
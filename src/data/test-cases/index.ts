import { newYorkInput } from "./newYork";
import { parisInput } from "./paris";
import { sanFranciscoInput } from "./sanFrancisco";
import { largeInput } from "./largeTest";
import { octagonTest } from "./simpleOctagon";
import type { Input, NormalizedInput } from "../../optimizer/types";
import { simpleLineInput } from "./simpleLine";
import { singleWallOver } from "./singleWallOver";
import { simpleCube } from "./simpleCube";
import { simpleElevated } from "./simpleElevated";
import { simpleCircle } from "./simpleCircle";
import { sketchLayoutTest } from "./sketchLayoutTest";
import { irregularPolygon } from "./irregularPolygon";
import { mixedObstacleTest } from "./mixedObstacleTest";

export type TestCase = {
  id: string;
  name: string;
  input: Input | NormalizedInput;
};

export const testCases: TestCase[] = [
  {
    id: "simple-line",
    name: "Simple Line",
    input: simpleLineInput,
  },
  {
    id: "simple-cube",
    name: "Simple Cube",
    input: simpleCube,
  },
  { id: "simple-elevated", name: "Simple Elevated", input: simpleElevated },
  {
    id: "single-wall-over",
    name: "Single Wall Over",
    input: singleWallOver,
  },
  {
    id: "simple-octagon",
    name: "Simple Octagon",
    input: octagonTest,
  },
  {
    id: "simple-circle",
    name: "Simple Circle",
    input: simpleCircle,
  },
  {
    id: "irregular-polygon",
    name: "Irregular Polygon",
    input: irregularPolygon,
  },
  {
    id: "sketch-layout",
    name: "Sketch Layout",
    input: sketchLayoutTest,
  },
  {
    id: "large",
    name: "Large Generated Test",
    input: largeInput,
  },
  {
    id: "mixed-obstacles",
    name: "Mixed Obstacles",
    input: mixedObstacleTest,
  },
  {
    id: "new-york",
    name: "New York",
    input: newYorkInput,
  },
  {
    id: "san-francisco",
    name: "San Francisco",
    input: sanFranciscoInput,
  },
  {
    id: "paris",
    name: "Paris",
    input: parisInput,
  },
];

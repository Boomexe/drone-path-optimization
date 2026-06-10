import type { TestCase } from "./types";

export const simpleClearPath: TestCase = {
  id: "simple-line",
  name: "Simple Line",
  input: {
    origin: { lat: 0, lon: 0 },
    start: { x: 0, y: 0, z: 0 },
    end: { x: 100, y: 100, z: 0 },
    floor: 0,
    ceiling: 100,
    obstacles: [],
  },
};
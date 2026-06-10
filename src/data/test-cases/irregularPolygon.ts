import type { NormalizedInput } from "../../optimizer/types";

export const irregularPolygon: NormalizedInput = {
  origin: { lat: 0, lon: 0 },
  start: { x: 240, y: 100, z: 0 },
  end: { x: 180, y: 0, z: 0 },
  floor: 0,
  ceiling: 100,
  obstacles: [
    {
      id: "POLY02",
      kind: "polygon",
      height: 50,
      points: [
        { x: 120, y: 120 },
        { x: 125, y: 95 },
        { x: 145, y: 75 },
        { x: 175, y: 70 },
        { x: 235, y: 70 },
        { x: 265, y: 75 },
        { x: 285, y: 95 },
        { x: 290, y: 120 },
        { x: 290, y: 60 },
        { x: 285, y: 35 },
        { x: 265, y: 15 },
        { x: 235, y: 10 },
        { x: 175, y: 10 },
        { x: 145, y: 15 },
        { x: 125, y: 35 },
        { x: 120, y: 60 },
      ],
    },
  ],
};

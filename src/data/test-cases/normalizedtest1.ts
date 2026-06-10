import type { Input, NormalizedInput } from "../../optimizer/types";

export const sampleNormalizedInput: NormalizedInput = {
  origin: {
    lat: 0,
    lon: 0,
  },
  start: { x: 0, y: 0, z: 0 },
  end: { x: 100, y: 100, z: 70 },
  floor: 0,
  ceiling: 80,
  obstacles: [
    {
      id: "A01",
      kind: "polygon",
      height: 20,
      points: [
        { x: 10, y: 10 },
        { x: 20, y: 10 },
        { x: 20, y: 20 },
        { x: 10, y: 20 },
      ],
    },
    {
      id: "A02",
      kind: "polygon",
      height: 20,
      points: [
        { x: 0, y: 60 },
        { x: 140, y: 60 },
        { x: 140, y: 90 },
        { x: 0, y: 90 },
      ],
    },
  ],
};

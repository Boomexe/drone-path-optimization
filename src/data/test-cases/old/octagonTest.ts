import type { NormalizedInput } from "../../../optimizer/types";

export const octagonTest: NormalizedInput = {
  origin: {
    lat: 0,
    lon: 0,
  },

  start: { x: 0, y: 0, z: 0 },
  end: { x: 300, y: 0, z: 0 },

  floor: 0,
  ceiling: 100,

  obstacles: [
    {
      id: "OCT01",
      kind: "polygon",
      height: 60,
      points: [
        { x: 130, y: -40 },
        { x: 170, y: -40 },
        { x: 200, y: -10 },
        { x: 200, y: 30 },
        { x: 170, y: 60 },
        { x: 130, y: 60 },
        { x: 100, y: 30 },
        { x: 100, y: -10 },
      ],
    },
  ],
};
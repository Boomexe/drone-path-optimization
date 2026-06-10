import type { NormalizedInput } from "../../optimizer/types";

export const simpleElevated: NormalizedInput = {
  origin: { lat: 0, lon: 0 },
  start: { x: 0, y: 0, z: 100 },
  end: { x: 100, y: 100, z: 100 },
  floor: 0,
  ceiling: 100,
  obstacles: [
    {
      id: "A01",
      kind: "polygon",
      height: 50,
      points: [
        { x: 40, y: 40 },
        { x: 60, y: 40 },
        { x: 60, y: 60 },
        { x: 40, y: 60 }
      ],
    }
  ],
};

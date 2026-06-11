import type { NormalizedInput } from "../../optimizer/types";

export const notAnObstacle: NormalizedInput = {
  origin: { lat: 0, lon: 0 },
  start: { x: 0, y: 0, z: 0 },
  end: { x: 100, y: 100, z: 0 },
  floor: 0,
  ceiling: 100,
  obstacles: [
    {
      id: "A01",
      kind: "polygon",
      height: 50,
      points: [
        { x: -100, y: 40 },
        { x: -60, y: 40 },
        { x: -60, y: 60 },
        { x: -100, y: 60 }
      ],
    }
  ],
};

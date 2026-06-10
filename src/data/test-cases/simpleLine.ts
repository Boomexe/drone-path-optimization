import type { NormalizedInput } from "../../optimizer/types";

export const simpleLineInput: NormalizedInput = {
  origin: { lat: 0, lon: 0 },
  start: { x: 0, y: 0, z: 0 },
  end: { x: 100, y: 100, z: 0 },
  floor: 0,
  ceiling: 100,
  obstacles: [],
};

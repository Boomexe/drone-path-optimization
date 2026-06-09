import type { Input } from "../../optimizer/types";

export const sampleInput: Input = {
  origin: {
    lat: 37.333,
    lon: -121.891,
    height: 0,
  },
  destination: {
    lat: 37.341,
    lon: -121.879,
    height: 0,
  },
  floor: 0,
  ceiling: 80,
  obstacles: [
    {
      id: "A10",
      kind: "polygon",
      height: 52,
      points: [
        { lat: 37.33755, lon: -121.88535 },
        { lat: 37.3386, lon: -121.88465 },
        { lat: 37.33825, lon: -121.8839 },
        { lat: 37.3372, lon: -121.8846 },
      ],
    },
    {
      id: "A11",
      kind: "polygon",
      height: 60,
      points: [
        { lat: 37.33865, lon: -121.8831 },
        { lat: 37.3397, lon: -121.8824 },
        { lat: 37.33935, lon: -121.88165 },
        { lat: 37.3383, lon: -121.88235 },
      ],
    },
    {
      id: "A12",
      kind: "polygon",
      height: 36,
      points: [
        { lat: 37.34005, lon: -121.8816 },
        { lat: 37.34095, lon: -121.88105 },
        { lat: 37.34065, lon: -121.88035 },
        { lat: 37.33975, lon: -121.8809 },
      ],
    },
  ],
};

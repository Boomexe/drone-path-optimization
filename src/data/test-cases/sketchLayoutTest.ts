import type { NormalizedInput } from "../../optimizer/types";

export const sketchLayoutTest: NormalizedInput = {
  origin: { lat: 0, lon: 0 },

  start: { x: 280, y: 40, z: 0 },
  end: { x: 80, y: 220, z: 0 },

  floor: 0,
  ceiling: 100,

  obstacles: [
    {
      id: "POLY01",
      kind: "polygon",
      height: 50,
      points: [
        { x: 70, y: 190 },
        { x: 110, y: 230 },
        { x: 150, y: 190 },
        { x: 110, y: 150 },
      ],
    },
    {
      id: "CIRCLE01",
      kind: "polygon",
      height: 50,
      points: [
        { x: 240, y: 230 },
        { x: 251.481, y: 227.716 },
        { x: 261.213, y: 221.213 },
        { x: 267.716, y: 211.481 },
        { x: 270, y: 200 },
        { x: 267.716, y: 188.519 },
        { x: 261.213, y: 178.787 },
        { x: 251.481, y: 172.284 },
        { x: 240, y: 170 },
        { x: 228.519, y: 172.284 },
        { x: 218.787, y: 178.787 },
        { x: 212.284, y: 188.519 },
        { x: 210, y: 200 },
        { x: 212.284, y: 211.481 },
        { x: 218.787, y: 221.213 },
        { x: 228.519, y: 227.716 },
      ],
    },
    {
      id: "POLY02",
      kind: "polygon",
      height: 50,
      points: [
        { x: 140, y: 60 },
        { x: 140, y: 160 },
        { x: 260, y: 160 },
        { x: 260, y: 60 },
      ],
    },
  ],
};
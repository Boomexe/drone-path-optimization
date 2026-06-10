import type { NormalizedInput, ObstacleXY } from "../../optimizer/types";

function makeRectangleObstacle(
  id: string,
  x: number,
  y: number,
  width: number,
  height2D: number,
  obstacleHeight: number,
): ObstacleXY {
  return {
    id,
    kind: "polygon",
    height: obstacleHeight,
    points: [
      { x, y },
      { x: x + width, y },
      { x: x + width, y: y + height2D },
      { x, y: y + height2D },
    ],
  };
}

const obstacles: ObstacleXY[] = [];

const columns = 20;
const rows = 12;

for (let row = 0; row < rows; row++) {
  for (let col = 0; col < columns; col++) {
    const idNumber = row * columns + col + 1;

    const x = 80 + col * 45;
    const y = 100 + row * 80;

    const width = 18 + ((row + col) % 3) * 4;
    const height2D = 22 + ((row * 2 + col) % 3) * 5;

    const isTooTall = (row + col) % 2 === 0;

    const obstacleHeight = isTooTall
      ? 120 + ((row * 7 + col * 11) % 80) // 120–199, above ceiling
      : 25 + ((row * 7 + col * 11) % 65); // 25–89, below ceiling

    obstacles.push(
      makeRectangleObstacle(
        `A${idNumber.toString().padStart(3, "0")}`,
        x,
        y,
        width,
        height2D,
        obstacleHeight,
      ),
    );
  }
}

export const largeInput: NormalizedInput = {
  origin: {
    lat: 0,
    lon: 0,
  },

  start: { x: 0, y: 0, z: 0 },
  end: { x: 1000, y: 1000, z: 80 },

  floor: 0,
  ceiling: 100,

  obstacles,
};

// Optional sanity check while developing.
// if (large200ObstacleTest.obstacles.length !== 200) {
//   throw new Error(
//     `Expected exactly 200 obstacles, got ${large200ObstacleTest.obstacles.length}`,
//   );
// }

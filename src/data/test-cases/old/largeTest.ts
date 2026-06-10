import type { NormalizedInput, ObstacleXY } from "../../../optimizer/types";

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
const rows = 20;

// Creates exactly 20 * 10 = 200 obstacles.
for (let row = 0; row < rows; row++) {
  for (let col = 0; col < columns; col++) {
    const idNumber = row * columns + col + 1;

    const x = 80 + col * 45;
    const y = 100 + row * 80;

    const width = 18 + ((row + col) % 3) * 4;
    const height2D = 22 + ((row * 2 + col) % 3) * 5;

    // Varied obstacle heights, all below ceiling.
    // Some can be flown over, some are taller and encourage going around.
    // const obstacleHeight = 15 + ((row * 7 + col * 11) % 55);
    const obstacleHeight = 1000;

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
import { pos2WithHeight } from "./coordUtils";
import { getPolygonCentroid } from "./polygonUtils";
import type { GraphNode, NormalizedInput, ObstacleXY, Pos2 } from "./types";

// NOTE: currently hardcoded offset, can be made configurable if needed
const OFFSET = 5;

function generateOffsetPoints(
  obstacle: ObstacleXY,
  offset: number,
): Pos2[] {
  const centroid = getPolygonCentroid(obstacle);

  const points: Pos2[] = [];

  for (const point of obstacle.points) {
    const dx = point.x - centroid.x;
    const dy = point.y - centroid.y;
    const length = Math.sqrt(dx * dx + dy * dy);

    const dxScaled = (dx / length) * offset;
    const dyScaled = (dy / length) * offset;

    points.push({ x: point.x + dxScaled, y: point.y + dyScaled });
  }

  return points;
}

export function generateNodeMap(input: NormalizedInput): GraphNode[] {
  const nodes: GraphNode[] = [];

  const globalHeights = generateGlobalHeightLayers(input);

  nodes.push({
    id: nodes.length,
    pos: input.start,
    kind: "start",
  });

  nodes.push({
    id: nodes.length,
    pos: input.end,
    kind: "end",
  });

  // Extra heights at the start position
  for (const height of globalHeights) {
    if (height === input.start.z) continue;

    nodes.push({
      id: nodes.length,
      pos: {
        x: input.start.x,
        y: input.start.y,
        z: height,
      },
      kind: "start-altitude",
    });
  }

  // Extra heights at the end position
  for (const height of globalHeights) {
    if (height === input.end.z) continue;

    nodes.push({
      id: nodes.length,
      pos: {
        x: input.end.x,
        y: input.end.y,
        z: height,
      },
      kind: "end-altitude",
    });
  }

  // Obstacle waypoints get only their own local height layers
  for (const obstacle of input.obstacles) {
    const offsetPoints = generateOffsetPoints(obstacle, OFFSET);
    const obstacleHeights = generateObstacleHeightLayers(input, obstacle);

    for (const point of offsetPoints) {
      for (const height of obstacleHeights) {
        nodes.push({
          id: nodes.length,
          pos: pos2WithHeight(point, height),
          kind: "obstacle",
        });
      }
    }
  }

  return nodes;
}

function generateGlobalHeightLayers(input: NormalizedInput): number[] {
  const heights = new Set<number>();

  heights.add(input.start.z);
  heights.add(input.end.z);
  heights.add(input.ceiling);

  return [...heights]
    .filter((height) => height >= input.floor && height <= input.ceiling)
    .sort((a, b) => a - b);
}

function generateObstacleHeightLayers(
  input: NormalizedInput,
  obstacle: ObstacleXY,
): number[] {
  const heights = new Set<number>();

  heights.add(input.start.z);
  heights.add(input.end.z);
  heights.add(input.ceiling);

  const obstacleHeight = obstacle.height;

  if (obstacleHeight >= input.floor && obstacleHeight <= input.ceiling) {
    heights.add(obstacleHeight);
  }

  return [...heights]
    .filter((height) => height >= input.floor && height <= input.ceiling)
    .sort((a, b) => a - b);
}
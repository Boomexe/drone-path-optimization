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
  const offsetPoints: Pos2[] = [];

  for (const obstacle of input.obstacles) {
    const points = generateOffsetPoints(obstacle, OFFSET);
    offsetPoints.push(...points);
  }

  const heights = generateHeightLayers(input);

  const nodes: GraphNode[] = [];

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

  // Extra heights at the start and end positions
  for (const height of heights) {
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

  for (const height of heights) {
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

  for (const point of offsetPoints) {
    for (const height of heights) {
      nodes.push({
        id: nodes.length,
        pos: pos2WithHeight(point, height),
        kind: "obstacle",
      });
    }
  }

  return nodes;
}

function generateHeightLayers(input: NormalizedInput): number[] {
  const heights = new Set<number>();

  heights.add(input.floor);
  heights.add(input.ceiling);
  heights.add(input.start.z);
  heights.add(input.end.z);

  for (const obstacle of input.obstacles) {
    const clearanceHeight = obstacle.height;

    if (clearanceHeight >= input.floor && clearanceHeight <= input.ceiling) {
      heights.add(clearanceHeight);
    }
  }

  return [...heights].sort((a, b) => a - b);
}
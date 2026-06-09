import { pos2WithHeight } from "./coordUtils";
import { getPolygonCentroid } from "./polygonUtils";
import type { GraphNode, NormalizedInput, ObstacleXY, Pos2 } from "./types";

// NOTE: currently hardcoded offset, can be made configurable if needed
const OFFSET = 5;

export function generateOffsetPoints(
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

  const nodes: GraphNode[] = [];

  nodes.push({
    id: nodes.length,
    pos: input.start,
  });

  nodes.push({
    id: nodes.length,
    pos: input.end,
  });

  for (const point of offsetPoints) {
    nodes.push({
      id: nodes.length,
      pos: pos2WithHeight(point, input.floor),
    });
  }

  return nodes;
}

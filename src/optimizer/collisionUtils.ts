import type { GraphNode, ObstacleXY, Pos2, Pos3 } from "./types";

const EPSILON = 1e-9;

function isPointInPolygon2D(point: Pos2, polygonPoints: Pos2[]): boolean {
  let isInside = false;

  for (
    let i = 0, j = polygonPoints.length - 1;
    i < polygonPoints.length;
    j = i++
  ) {
    const a = polygonPoints[i];
    const b = polygonPoints[j];

    const crossesY = a.y > point.y !== b.y > point.y;

    if (!crossesY) continue;

    const xIntersection = ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y) + a.x;

    if (point.x < xIntersection) {
      isInside = !isInside;
    }
  }

  return isInside;
}

function isPointInObstacle(point: Pos3, obstacle: ObstacleXY): boolean {
  if (point.z > obstacle.height) return false;

  return isPointInPolygon2D(point, obstacle.points);
}

function orientation(a: Pos2, b: Pos2, c: Pos2): number {
  return (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y);
}

function isOnSegment(a: Pos2, b: Pos2, c: Pos2): boolean {
  return (
    Math.min(a.x, c.x) <= b.x &&
    b.x <= Math.max(a.x, c.x) &&
    Math.min(a.y, c.y) <= b.y &&
    b.y <= Math.max(a.y, c.y)
  );
}

function doSegmentsIntersect(p1: Pos2, p2: Pos2, p3: Pos2, p4: Pos2): boolean {
  const o1 = orientation(p1, p2, p3);
  const o2 = orientation(p1, p2, p4);
  const o3 = orientation(p3, p4, p1);
  const o4 = orientation(p3, p4, p2);

  if (o1 * o2 < 0 && o3 * o4 < 0) {
    return true;
  }

  if (Math.abs(o1) < EPSILON && isOnSegment(p1, p3, p2)) return true;
  if (Math.abs(o2) < EPSILON && isOnSegment(p1, p4, p2)) return true;
  if (Math.abs(o3) < EPSILON && isOnSegment(p3, p1, p4)) return true;
  if (Math.abs(o4) < EPSILON && isOnSegment(p3, p2, p4)) return true;

  return false;
}

function doesSegmentIntersectPolygon2D(
  a: Pos2,
  b: Pos2,
  polygonPoints: Pos2[],
): boolean {
  if (
    isPointInPolygon2D(a, polygonPoints) ||
    isPointInPolygon2D(b, polygonPoints)
  ) {
    return true;
  }

  for (let i = 0; i < polygonPoints.length; i++) {
    const c = polygonPoints[i];
    const d = polygonPoints[(i + 1) % polygonPoints.length];

    if (doSegmentsIntersect(a, b, c, d)) {
      return true;
    }
  }

  return false;
}

export function isValidEdge(
  from: GraphNode,
  to: GraphNode,
  obstacles: ObstacleXY[],
): boolean {
  for (const obstacle of obstacles) {
    const crossesPolygon2D = doesSegmentIntersectPolygon2D(
      from.pos,
      to.pos,
      obstacle.points,
    );

    if (!crossesPolygon2D) {
      continue;
    }

    const lowestEdgeHeight = Math.min(from.pos.z, to.pos.z);

    if (lowestEdgeHeight <= obstacle.height) {
      return false;
    }
  }

  return true;
}

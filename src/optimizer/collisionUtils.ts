import type { GraphNode, ObstacleXY, Pos2 } from "./types";

const EPSILON = 1e-9;

export type Box2 = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

export type BoundedObstacleXY = ObstacleXY & {
  bounds: Box2;
};

function getSegmentBox(a: Pos2, b: Pos2): Box2 {
  return {
    minX: Math.min(a.x, b.x),
    maxX: Math.max(a.x, b.x),
    minY: Math.min(a.y, b.y),
    maxY: Math.max(a.y, b.y),
  };
}

function getPolygonBox(points: Pos2[]): Box2 {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const point of points) {
    minX = Math.min(minX, point.x);
    maxX = Math.max(maxX, point.x);
    minY = Math.min(minY, point.y);
    maxY = Math.max(maxY, point.y);
  }

  return {
    minX,
    maxX,
    minY,
    maxY,
  };
}

function boxesOverlap(a: Box2, b: Box2): boolean {
  return (
    a.minX <= b.maxX && a.maxX >= b.minX && a.minY <= b.maxY && a.maxY >= b.minY
  );
}

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
  boundedObstacles: BoundedObstacleXY[],
): boolean {
  const edgeBox = getSegmentBox(from.pos, to.pos);
  const lowestEdgeHeight = Math.min(from.pos.z, to.pos.z);

  for (const obstacle of boundedObstacles) {
    if (lowestEdgeHeight > obstacle.height) {
      continue;
    }

    // Skips lots of slow edge collision checks
    if (!boxesOverlap(edgeBox, obstacle.bounds)) {
      continue;
    }

    const crossesPolygon2D = doesSegmentIntersectPolygon2D(
      from.pos,
      to.pos,
      obstacle.points,
    );

    if (crossesPolygon2D) {
      return false;
    }
  }

  return true;
}

export function generateObstacleBounds(
  obstacles: ObstacleXY[],
): BoundedObstacleXY[] {
  return obstacles.map((obstacle) => ({
    ...obstacle,
    bounds: getPolygonBox(obstacle.points),
  }));
}

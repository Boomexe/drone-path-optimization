import type { ObstacleXY, Pos2 } from "./types";

export function getPolygonCentroid(obstacle: ObstacleXY): Pos2 {
    const points = obstacle.points;

    if (points.length === 0) {
        throw new Error("Polygon has no points, can't compute centeroid");
    }

    let xSum = 0;
    let ySum = 0;

    for (const point of points) {
        xSum += point.x;
        ySum += point.y;
    }

    return {
        x: xSum / points.length,
        y: ySum / points.length,
    };
}
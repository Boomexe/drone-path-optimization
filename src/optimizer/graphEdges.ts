import { isValidEdge } from "./collisionUtils";
import { dist3D } from "./coordUtils";
import type { GraphEdge, GraphNode, ObstacleXY } from "./types";

export function buildGraphEdges(
  nodes: GraphNode[],
  obstacles: ObstacleXY[],
): GraphEdge[] {
  const edges: GraphEdge[] = [];

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const from = nodes[i];
      const to = nodes[j];

      if (from.id === to.id) {
        continue;
      }

      if (isValidEdge(from, to, obstacles)) {
        const cost = dist3D(from.pos, to.pos);

        edges.push(
          {
            from: from.id,
            to: to.id,
            cost: cost,
          },
          {
            from: to.id,
            to: from.id,
            cost: cost,
          },
        );
      }
    }
  }

  return edges;
}

import { generateObstacleBounds, isValidEdge } from "./collisionUtils";
import { dist3DSquared } from "./coordUtils";
import type { GraphEdge, GraphNode, ObstacleXY } from "./types";

const MAX_EDGE_COST = 200; // Arbitrary threshold to skip very long edges
const MAX_EDGE_COST_SQUARED = MAX_EDGE_COST * MAX_EDGE_COST;

export function buildGraphEdges(
  nodes: GraphNode[],
  obstacles: ObstacleXY[],
): GraphEdge[] {
  const edges: GraphEdge[] = [];
  const boundedObstacles = generateObstacleBounds(obstacles);

  const isImportantNode = nodes.map(
    (node) =>
      node.kind === "start" ||
      node.kind === "start-altitude" ||
      node.kind === "end" ||
      node.kind === "end-altitude",
  );

  let totalPairs = 0;
  let skippedByDistance = 0;
  let edgeValidityChecks = 0;
  let validPairs = 0;

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const from = nodes[i];
      const to = nodes[j];

      if (from.id === to.id) {
        continue;
      }

      totalPairs++;

      const distSquared = dist3DSquared(from.pos, to.pos);

      const isImportantPair = isImportantNode[i] || isImportantNode[j];

      // Prune unimportant edges with high distances
      if (distSquared > MAX_EDGE_COST_SQUARED && !isImportantPair) {
        skippedByDistance++;
        continue;
      }

      const cost = Math.sqrt(distSquared);

      edgeValidityChecks++;

      if (!isValidEdge(from, to, boundedObstacles)) {
        continue;
      }

      validPairs++;

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

  console.log({
    totalPairs,
    skippedByDistance,
    collisionChecks: edgeValidityChecks,
    validPairs,
    directedEdges: edges.length,
  });

  return edges;
}
import { isValidEdge } from "./collisionUtils";
import { dist3D } from "./coordUtils";
import type { GraphEdge, GraphNode, ObstacleXY } from "./types";

const MAX_EDGE_COST = 200; // Arbitrary threshold to skip very long edges

export function buildGraphEdges(
  nodes: GraphNode[],
  obstacles: ObstacleXY[]
): GraphEdge[] {
  const edges: GraphEdge[] = [];

  let totalPairs = 0;
  let skippedByDistance = 0;
  let collisionChecks = 0;
  let validPairs = 0;

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const from = nodes[i];
      const to = nodes[j];

      if (from.id === to.id) {
        continue;
      }

      totalPairs++;

      const cost = dist3D(from.pos, to.pos);

      // Prune edges with high distances
      if (cost > MAX_EDGE_COST && !isImportantEdge(from, to)) {
        skippedByDistance++;
        continue;
      }

      collisionChecks++;

      if (!isValidEdge(from, to, obstacles)) {
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
    collisionChecks,
    validPairs,
    directedEdges: edges.length,
  });

  return edges;
}

// function shouldTryEdge(from: GraphNode, to: GraphNode, input: NormalizedInput): boolean {
  
// }

function isImportantEdge(from: GraphNode, to: GraphNode): boolean {
  return (
    isStartFamily(from) ||
    isStartFamily(to) ||
    isEndFamily(from) ||
    isEndFamily(to)
  );
}

function isStartFamily(node: GraphNode): boolean {
  return node.kind === "start" || node.kind === "start-altitude";
}

function isEndFamily(node: GraphNode): boolean {
  return node.kind === "end" || node.kind === "end-altitude";
}
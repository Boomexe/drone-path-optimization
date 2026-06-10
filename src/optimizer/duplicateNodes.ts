import type { GraphNode } from "./types";

export function countDuplicateNodes(nodes: GraphNode[]): {
  totalNodes: number;
  uniqueNodes: number;
  duplicateNodes: number;
  duplicateGroups: number;
} {
  const counts = new Map<string, number>();

  for (const node of nodes) {
    const key = getNodeKey(node);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  let duplicateNodes = 0;
  let duplicateGroups = 0;

  for (const count of counts.values()) {
    if (count > 1) {
      duplicateGroups++;
      duplicateNodes += count - 1;
    }
  }

  return {
    totalNodes: nodes.length,
    uniqueNodes: counts.size,
    duplicateNodes,
    duplicateGroups,
  };
}

function getNodeKey(node: GraphNode): string {
  return `${roundCoord(node.pos.x)},${roundCoord(node.pos.y)},${roundCoord(node.pos.z)}`;
}

function roundCoord(value: number): number {
  return Math.round(value * 1_000_000) / 1_000_000;
}
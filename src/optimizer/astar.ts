import { AStarNode } from "./aStarNode";
import { dist3D } from "./coordUtils";
import { Heap } from "./heap";
import type { GraphEdge, GraphNode } from "./types";

export type AStarResult = {
  path: GraphNode[];
  distance: number;
};

export function astar(
  nodes: GraphNode[],
  edges: GraphEdge[],
  startId: number,
  endId: number,
): AStarResult | null {
  const adjacency = new Map<number, GraphEdge[]>();

  for (const edge of edges) {
    const outgoing = adjacency.get(edge.from) ?? [];
    outgoing.push(edge);
    adjacency.set(edge.from, outgoing);
  }

  const searchNodes = nodes.map((node) => new AStarNode(node));
  const searchNodeById = new Map(searchNodes.map((node) => [node.id, node]));

  const start = searchNodeById.get(startId);
  const end = searchNodeById.get(endId);

  if (!start || !end) return null;

  const openSet = new Heap<AStarNode>(nodes.length);
  const closedSet = new Set<number>();

  start.gCost = 0;
  start.hCost = dist3D(start.graphNode.pos, end.graphNode.pos);

  openSet.add(start);

  while (openSet.count() > 0) {
    let current = openSet.removeFirst();

    if (current.id == end.id) {
      return {
        path: retracePath(start, end),
        distance: end.gCost,
      };
    }

    closedSet.add(current.id);

    for (const adjacentEdge of adjacency.get(current.id) ?? []) {
      if (closedSet.has(adjacentEdge.to)) {
        continue;
      }

      const neighbor = searchNodeById.get(adjacentEdge.to);

      if (!neighbor) continue;

      const tentativeGCost = current.gCost + adjacentEdge.cost;

      if (tentativeGCost < neighbor.gCost) {
        neighbor.gCost = tentativeGCost;
        neighbor.hCost = dist3D(neighbor.graphNode.pos, end.graphNode.pos);
        neighbor.parent = current;

        if (!openSet.contains(neighbor)) {
          openSet.add(neighbor);
        } else {
          openSet.updateItem(neighbor);
        }
      }
    }
  }

  return null;
}

function retracePath(startNode: AStarNode, endNode: AStarNode): GraphNode[] {
  const path: GraphNode[] = [];

  let current: AStarNode | null = endNode;

  while (current !== null && current.id !== startNode.id) {
    path.push(current.graphNode);
    current = current.parent;
  }

  path.push(startNode.graphNode);
  path.reverse();

  return path;
}

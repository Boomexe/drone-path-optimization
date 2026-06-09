import { dist3D } from "./coordUtils";
import type { GraphEdge, GraphNode } from "./types";

export function astar(
  nodes: GraphNode[],
  edges: GraphEdge[],
  startId: number,
  endId: number,
): GraphNode[] | null {
	const nodeById = new Map(nodes.map((node) => [node.id, node]));
	const adjacency = new Map<number, GraphEdge[]>();

	for (const edge of edges) {
    const outgoing = adjacency.get(edge.from) ?? [];
    outgoing.push(edge);
    adjacency.set(edge.from, outgoing);
  }

	const start = nodeById.get(startId);
	const end = nodeById.get(endId);

	if (!start || !end) return null;

	const openSet: GraphNode[] = [start];
	const closedSet = new Set<number>();

	const gCost = new Map<number, number>();
	const fCost = new Map<number, number>();
	const cameFrom = new Map<number, number>();

	function hCost(node: GraphNode): number {
		return dist3D(node.pos, end!.pos);
	}

	gCost.set(startId, 0);
	fCost.set(startId, hCost(start));

	while (openSet.length > 0) {
		let current = openSet[0];
		let currentIndex = 0;

		for (let i = 1; i < openSet.length; i++) {
			if (fCost.get(openSet[i].id)! < fCost.get(current.id)! || fCost.get(openSet[i].id) == fCost.get(current.id) && hCost(openSet[i]) < hCost(current)) {
				current = openSet[i];
				currentIndex = i;
			}
		}

		openSet.splice(currentIndex, 1);
		
		if (current.id == end.id) {
			return retracePath(start, end, cameFrom, nodeById);
		}

		closedSet.add(current.id);

		for (const adjacentEdge of adjacency.get(current.id) ?? []) {
			if (closedSet.has(adjacentEdge.to)) {
				continue;
			}

			const neighbor = nodeById.get(adjacentEdge.to);

			if (!neighbor) continue;

			const tentativeGCost = (gCost.get(current.id) ?? Infinity) + adjacentEdge.cost;

			if (tentativeGCost < (gCost.get(adjacentEdge.to) ?? Infinity) || !openSet.some((node) => node.id === adjacentEdge.to)) {
				gCost.set(adjacentEdge.to, tentativeGCost);
				fCost.set(adjacentEdge.to, tentativeGCost + hCost(neighbor));
				cameFrom.set(adjacentEdge.to, current.id);

				if (!openSet.some((node) => node.id === adjacentEdge.to)) {
					openSet.push(nodeById.get(adjacentEdge.to)!);
				}
			}
		}
	}

	return null;
}

function retracePath(startNode: GraphNode, endNode: GraphNode, cameFrom: Map<number, number>, nodeById: Map<number, GraphNode>): GraphNode[] {
	const path: GraphNode[] = [];

	let current: GraphNode = endNode;

	while (current.id !== startNode.id) {
		path.push(current);
		current = nodeById.get(cameFrom.get(current.id)!)!;
	}

	path.push(startNode);
	path.reverse();
	return path;
}
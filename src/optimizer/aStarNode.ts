import type { HeapItem } from "./heap";
import type { GraphNode } from "./types";

export class AStarNode implements HeapItem<AStarNode> {
  heapIndex: number = 0;
  parent: AStarNode | null = null;

  gCost = Infinity;
  hCost = 0;

  public graphNode: GraphNode;

  constructor(graphNode: GraphNode) {
    this.graphNode = graphNode;
  }

  get id(): number {
    return this.graphNode.id;
  }

  get fCost(): number {
    return this.gCost + this.hCost;
  }

  compareTo(other: AStarNode): number {
    let compare: number = other.fCost - this.fCost;
    if (compare === 0) {
      compare = other.hCost - this.hCost;
    }
    return compare;
  }
}

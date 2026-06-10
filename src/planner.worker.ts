import { astar } from "./optimizer/astar";
import { generateNodeMap } from "./optimizer/generateNodeMap";
import { buildGraphEdges } from "./optimizer/graphEdges";
import { getNormalizedInput } from "./optimizer/inputHandling";
import type {
  GraphEdge,
  GraphNode,
  Input,
  NormalizedInput,
  Pos3,
} from "./optimizer/types";

type WorkerRequest = {
  input: Input | NormalizedInput;
};

type WorkerSuccessResponse = {
  success: true;
  normalizedInput: NormalizedInput;
  nodes: GraphNode[];
  edges: GraphEdge[];
  path: Pos3[];
  stats: {
    totalMs: number;
    nodesMs: number;
    edgesMs: number;
    astarMs: number;
    nodeCount: number;
    edgeCount: number;
    pathLength: number;
  };
  selectedPath: GraphNode[];
};

type WorkerFailureResponse = {
  success: false;
  normalizedInput?: NormalizedInput;
  nodes?: GraphNode[];
  edges?: GraphEdge[];
  path?: Pos3[];
  message: string;
  stats?: {
    totalMs: number;
    nodesMs: number;
    edgesMs: number;
    astarMs: number;
    nodeCount: number;
    edgeCount: number;
  };
};

// type WorkerResponse = WorkerSuccessResponse | WorkerFailureResponse;

self.onmessage = (event: MessageEvent<WorkerRequest>) => {
  const totalStart = performance.now();

  let normalizedInput: NormalizedInput | undefined;
  let nodes: GraphNode[] = [];
  let edges: GraphEdge[] = [];

  try {
    normalizedInput = getNormalizedInput(event.data.input);

    const nodesStart = performance.now();
    nodes = generateNodeMap(normalizedInput);
    const nodesEnd = performance.now();

    const edgesStart = performance.now();
    edges = buildGraphEdges(nodes, normalizedInput.obstacles);
    const edgesEnd = performance.now();

    const startId = nodes[0].id;
    const endId = nodes[1].id;

    const astarStart = performance.now();
    const pathNodes = astar(nodes, edges, startId, endId);
    const astarEnd = performance.now();

    const totalEnd = performance.now();

    if (!pathNodes) {
      const response: WorkerFailureResponse = {
        success: false,
        normalizedInput,
        nodes,
        edges,
        path: [],
        message: "No path found",
        stats: {
          totalMs: totalEnd - totalStart,
          nodesMs: nodesEnd - nodesStart,
          edgesMs: edgesEnd - edgesStart,
          astarMs: astarEnd - astarStart,
          nodeCount: nodes.length,
          edgeCount: edges.length,
        },
      };

      self.postMessage(response);
      return;
    }

    const response: WorkerSuccessResponse = {
      success: true,
      normalizedInput,
      nodes,
      edges,
      path: pathNodes.map((node) => node.pos),
      stats: {
        totalMs: totalEnd - totalStart,
        nodesMs: nodesEnd - nodesStart,
        edgesMs: edgesEnd - edgesStart,
        astarMs: astarEnd - astarStart,
        nodeCount: nodes.length,
        edgeCount: edges.length,
        pathLength: pathNodes.length,
      },
      selectedPath: pathNodes,
    };

    self.postMessage(response);
  } catch (error) {
    const totalEnd = performance.now();

    const response: WorkerFailureResponse = {
      success: false,
      normalizedInput,
      nodes,
      edges,
      path: [],
      message: error instanceof Error ? error.message : "Unknown worker error",
      stats: {
        totalMs: totalEnd - totalStart,
        nodesMs: 0,
        edgesMs: 0,
        astarMs: 0,
        nodeCount: nodes.length,
        edgeCount: edges.length,
      },
    };

    self.postMessage(response);
  }
};
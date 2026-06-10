import { testCases } from "./data/test-cases";
import type {
  GraphEdge,
  GraphNode,
  ObstacleXY,
  Pos2,
  Pos3,
} from "./optimizer/types";

document.querySelector("#app")!.innerHTML = `
  <h1>Drone Path Optimizer</h1>
  <p>no css because budget cuts</p>

  <div style="margin-bottom: 12px;">
    <label for="test-case-select">Test case:</label>
    <select id="test-case-select"></select>
    <button id="run-button">Run Planner</button>
    <span id="status" style="margin-left: 12px;">Ready</span>
  </div>

  <canvas id="debug-canvas" width="900" height="650"></canvas>
  <div id="selected-path"></div>
  <pre id="debug-output"></pre>
`;

const canvas = document.querySelector<HTMLCanvasElement>("#debug-canvas")!;
const output = document.querySelector<HTMLPreElement>("#debug-output")!;
const statusText = document.querySelector<HTMLSpanElement>("#status")!;
const select = document.querySelector<HTMLSelectElement>("#test-case-select")!;
const runButton = document.querySelector<HTMLButtonElement>("#run-button")!;
const selectedPathDiv =
  document.querySelector<HTMLDivElement>("#selected-path")!;

for (const testCase of testCases) {
  const option = document.createElement("option");
  option.value = testCase.id;
  option.textContent = testCase.name;
  select.appendChild(option);
}

let currentWorker: Worker | null = null;

runButton.addEventListener("click", () => {
  runSelectedTestCase();
});

function runSelectedTestCase(): void {
  const selectedId = select.value;
  const selectedCase = testCases.find((testCase) => testCase.id === selectedId);

  if (!selectedCase) {
    output.textContent = `Could not find test case: ${selectedId}`;
    selectedPathDiv.textContent = "";
    return;
  }

  if (currentWorker) {
    currentWorker.terminate();
    currentWorker = null;
  }

  statusText.textContent = "Computing...";
  runButton.disabled = true;
  select.disabled = true;

  selectedPathDiv.textContent = "";
  output.textContent = JSON.stringify(
    {
      message: "Computing path...",
      testCase: selectedCase.name,
    },
    null,
    2,
  );

  const worker = new Worker(new URL("./planner.worker.ts", import.meta.url), {
    type: "module",
  });

  currentWorker = worker;

  worker.onmessage = (event) => {
    const result = event.data;

    currentWorker = null;
    worker.terminate();

    runButton.disabled = false;
    select.disabled = false;
    statusText.textContent = result.success ? "Done" : "Failed";

    if (!result.normalizedInput) {
      output.textContent = JSON.stringify(result, null, 2);
      selectedPathDiv.textContent = "";
      return;
    }

    console.time("render");

    renderDebugCanvas(canvas, {
      obstacles: result.normalizedInput.obstacles,
      nodes: result.nodes ?? [],
      edges: result.edges ?? [],
      path: result.path ?? [],
    });

    console.timeEnd("render");

    output.textContent = JSON.stringify(
      {
        success: result.success,
        message: result.message,
        testCase: selectedCase.name,
        stats: result.stats,
        selctedPath: result.selectedPath,
      },
      null,
      2,
    );
    selectedPathDiv.textContent = "";

    const selectedPathLabel = document.createElement("h2");
    selectedPathLabel.textContent = "Selected Path";
    selectedPathDiv.appendChild(selectedPathLabel);

    const table = document.createElement("table");
    table.style.borderCollapse = "collapse";
    table.style.marginTop = "8px";
    table.style.width = "100%";

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    const headers = ["Step", "Node ID", "X", "Y", "Z"];

    for (const header of headers) {
      const th = document.createElement("th");
      th.textContent = header;
      th.style.border = "1px solid black";
      th.style.padding = "4px 8px";
      th.style.textAlign = "left";
      headerRow.appendChild(th);
    }

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    result.selectedPath.forEach((node: GraphNode, index: number) => {
      const row = document.createElement("tr");

      const values = [
        index.toString(),
        node.id.toString(),
        node.pos.x.toFixed(2),
        node.pos.y.toFixed(2),
        node.pos.z.toFixed(2),
      ];

      for (const value of values) {
        const td = document.createElement("td");
        td.textContent = value;
        td.style.border = "1px solid black";
        td.style.padding = "4px 8px";
        row.appendChild(td);
      }

      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    selectedPathDiv.appendChild(table);
  };

  worker.onerror = (error) => {
    currentWorker = null;
    worker.terminate();

    runButton.disabled = false;
    select.disabled = false;
    statusText.textContent = "Worker error";
    selectedPathDiv.textContent = "";
    output.textContent = JSON.stringify(
      {
        success: false,
        message: error.message,
        filename: error.filename,
        lineno: error.lineno,
        colno: error.colno,
      },
      null,
      2,
    );
  };

  worker.postMessage({
    input: selectedCase.input,
  });
}

// Optional: automatically run the first test case on page load.
// runSelectedTestCase();

type RenderData = {
  obstacles: ObstacleXY[];
  nodes: GraphNode[];
  edges: GraphEdge[];
  path: Pos3[];
};

function renderDebugCanvas(canvas: HTMLCanvasElement, data: RenderData): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const toCanvas = createCanvasTransform(canvas, data);

  drawObstacles(ctx, data.obstacles, toCanvas);
  // drawEdges(ctx, data.edges, data.nodes, toCanvas);
  drawNodes(ctx, data.nodes, toCanvas);
  drawPath(ctx, data.path, toCanvas);
}

function createCanvasTransform(
  canvas: HTMLCanvasElement,
  data: RenderData,
): (point: Pos2) => Pos2 {
  const allPoints: Pos2[] = [
    ...data.nodes.map((node) => node.pos),
    ...data.obstacles.flatMap((obstacle) => obstacle.points),
  ];

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const point of allPoints) {
    minX = Math.min(minX, point.x);
    maxX = Math.max(maxX, point.x);
    minY = Math.min(minY, point.y);
    maxY = Math.max(maxY, point.y);
  }

  const padding = 40;
  const worldWidth = Math.max(1, maxX - minX);
  const worldHeight = Math.max(1, maxY - minY);

  const scale = Math.min(
    (canvas.width - padding * 2) / worldWidth,
    (canvas.height - padding * 2) / worldHeight,
  );

  return (point: Pos2) => ({
    x: padding + (point.x - minX) * scale,
    y: canvas.height - padding - (point.y - minY) * scale,
  });
}

function drawObstacles(
  ctx: CanvasRenderingContext2D,
  obstacles: ObstacleXY[],
  toCanvas: (point: Pos2) => Pos2,
): void {
  for (const obstacle of obstacles) {
    if (obstacle.points.length === 0) continue;

    const first = toCanvas(obstacle.points[0]);

    ctx.beginPath();
    ctx.moveTo(first.x, first.y);

    for (let i = 1; i < obstacle.points.length; i++) {
      const point = toCanvas(obstacle.points[i]);
      ctx.lineTo(point.x, point.y);
    }

    ctx.closePath();

    ctx.fillStyle = "rgba(80, 80, 80, 0.35)";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();

    const center = averagePoint(obstacle.points);
    const canvasCenter = toCanvas(center);

    ctx.fillStyle = "black";
    ctx.font = "12px sans-serif";
    ctx.fillText(`${obstacle.height}m`, canvasCenter.x + 4, canvasCenter.y - 4);
  }
}

function drawEdges(
  ctx: CanvasRenderingContext2D,
  edges: GraphEdge[],
  nodes: GraphNode[],
  toCanvas: (point: Pos2) => Pos2,
): void {
  const nodeById = new Map(nodes.map((node) => [node.id, node]));

  ctx.strokeStyle = "rgba(0, 0, 0, 0.10)";
  ctx.lineWidth = 1;

  for (const edge of edges) {
    const from = nodeById.get(edge.from);
    const to = nodeById.get(edge.to);

    if (!from || !to) continue;

    const a = toCanvas(from.pos);
    const b = toCanvas(to.pos);

    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }
}

function drawNodes(
  ctx: CanvasRenderingContext2D,
  nodes: GraphNode[],
  toCanvas: (point: Pos2) => Pos2,
): void {
  for (const node of nodes) {
    const point = toCanvas(node.pos);

    ctx.beginPath();
    ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);

    if (node.id === 0) {
      ctx.fillStyle = "green";
    } else if (node.id === 1) {
      ctx.fillStyle = "blue";
    } else {
      ctx.fillStyle = "rgba(0, 80, 200, 0.75)";
    }

    ctx.fill();

    if (node.id === 0 || node.id === 1) {
      ctx.fillStyle = "black";
      ctx.font = "12px sans-serif";
      ctx.fillText(node.id === 0 ? "Start" : "End", point.x + 6, point.y - 6);
    }
  }
}

function drawPath(
  ctx: CanvasRenderingContext2D,
  path: Pos3[],
  toCanvas: (point: Pos2) => Pos2,
): void {
  if (path.length === 0) return;

  const first = toCanvas(path[0]);

  ctx.beginPath();
  ctx.moveTo(first.x, first.y);

  for (let i = 1; i < path.length; i++) {
    const point = toCanvas(path[i]);
    ctx.lineTo(point.x, point.y);
  }

  ctx.strokeStyle = "red";
  ctx.lineWidth = 4;
  ctx.stroke();

  for (const point of path) {
    const canvasPoint = toCanvas(point);

    ctx.beginPath();
    ctx.arc(canvasPoint.x, canvasPoint.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();

    ctx.fillStyle = "black";
    ctx.font = "11px sans-serif";
    ctx.fillText(
      `${point.z.toFixed(0)}m`,
      canvasPoint.x + 6,
      canvasPoint.y - 6,
    );
  }
}

function averagePoint(points: Pos2[]): Pos2 {
  let x = 0;
  let y = 0;

  for (const point of points) {
    x += point.x;
    y += point.y;
  }

  return {
    x: x / points.length,
    y: y / points.length,
  };
}

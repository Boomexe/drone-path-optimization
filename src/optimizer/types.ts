export type LatLon = {
  lat: number;
  lon: number;
};

export type LatLonHeight = LatLon & {
  height: number;
};

export type Pos2 = {
  x: number;
  y: number;
};

export type Pos3 = Pos2 & {
  z: number;
};

export type Node = {
  id: number;
  pos: Pos3;
};

export type Edge = {
  from: number;
  to: number;
  cost: number;
};

export type ObstacleInput = {
  id?: string;
  kind: "polygon";
  points: LatLon[];
  height: number;
};

export type ObstacleXY = {
  id?: string;
  kind: "polygon";
  points: Pos2[];
  height: number;
};

export type ObstacleXYZ = {
  id?: string;
  kind: "polygon";
  points: Pos3[];
};

export type Input = {
  start: LatLonHeight;
  end: LatLonHeight;

  floor: number;
  ceiling: number;

  obstacles: ObstacleInput[];
};

export type NormalizedInput = {
  origin: LatLon;
  start: Pos3;
  end: Pos3;
  floor: number;
  ceiling: number;
  obstacles: ObstacleXY[];
};

export type EdgeEvaluation = {
  valid: boolean;
  cost: number;
  requiredHeight: number;
  crossedObstacleIds: number[];
};

export type PathWaypoint = LatLon & {
  height: number;
};

export type Result = {
  success: boolean;
  path: PathWaypoint[];
  totalDistance: number;
};

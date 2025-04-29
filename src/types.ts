export interface AnimationParams {
  x: number;
  y: number;
}

export interface Path {
  from: AnimationParams;
  to: AnimationParams;
}

export interface WindowParams {
  x: number;
  y: number;
  width: number;
  height: number;
}

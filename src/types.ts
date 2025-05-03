export interface AnimationParams {
  x: number;
  y: number;
}

export interface Path {
  from: AnimationParams;
  to: AnimationParams;
}

export type Storage = Record<string, WindowParams>;

export interface WindowParams {
  x: number;
  y: number;
  width: number;
  height: number;
  id: string;
}

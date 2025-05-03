export interface AnimationParams {
  x?: number;
  y?: number;
}

export interface Path {
  from: AnimationParams;
  to: AnimationParams;
}

export type WindowsParamsStorage = Record<string, WindowParams>;

export type AnimationStorage = Record<string, boolean>;

export interface WindowParams {
  x: number;
  y: number;
  width: number;
  height: number;
  id: string;
}

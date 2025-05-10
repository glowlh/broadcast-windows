import {
  WindowParams,
  Path as IPath,
  AnimationParams,
  Sectors,
} from "../types.ts";

const CALCULATION_MAP: Record<
  Sectors,
  (window: WindowParams, screenPath: IPath) => AnimationParams
> = {
  RIGHT: (window: WindowParams, screenPath: IPath) => {
    const { from, to } = screenPath;
    return {
      x: window.x + window.width,
      y:
        ((to.y - from.y) * (window.x + window.width - from.x)) /
          (to.x - from.x) +
        from.y,
    };
  },
  LEFT: (window: WindowParams, screenPath: IPath) => {
    const { from, to } = screenPath;
    return {
      x: window.x,
      y: ((to.y - from.y) * (window.x - from.x)) / (to.x - from.x) + from.y,
    };
  },
  TOP: (window: WindowParams, screenPath: IPath) => {
    const { from, to } = screenPath;
    return {
      y: window.y,
      x: ((to.x - from.x) * (window.y - from.x)) / (to.y - from.y) + from.x,
    };
  },
  BOTTOM: (window: WindowParams, screenPath: IPath) => {
    const { from, to } = screenPath;
    return {
      y: window.y + window.height,
      x:
        ((to.x - from.x) * (window.y + window.height - from.x)) /
          (to.y - from.y) +
        from.x,
    };
  },
};

export class Path {
  private _pX;
  private _pY;
  private _window: WindowParams | null;
  private _anotherWindow: WindowParams | null;
  private _isMain: boolean = false;

  constructor(props: {
    portalPosition: DOMRect;
    windowParams: WindowParams | null;
    anotherWindowParams: WindowParams | null;
    isMain: boolean;
  }) {
    const { portalPosition, windowParams, anotherWindowParams, isMain } = props;

    const { x, y } = portalPosition;
    this._pX = x;
    this._pY = y;
    this._window = windowParams;
    this._anotherWindow = anotherWindowParams;
    this._isMain = isMain;
  }

  private _calcScreenPortalPath(): IPath | null {
    if (!this._window || !this._anotherWindow) {
      return null;
    }

    if (this._isMain) {
      return {
        from: {
          x: this._pX + this._window.x,
          y: this._pY + this._window.y,
        },
        to: {
          x: this._pX + this._anotherWindow.x,
          y: this._pY + this._anotherWindow.y,
        },
      };
    }

    return null;
    // {
    //   from: {
    //     x: this._pX + this._anotherWindow.x,
    //     y: this._pY + this._anotherWindow.y,
    //   },
    //   to: {
    //     x: this._pX + this._window.x,
    //     y: this._pY + this._window.y,
    //   },
    // };
  }

  private _calcScreenIntersectionPoint(): AnimationParams | null {
    const path = this._calcScreenPortalPath();
    console.log("path", path);
    if (!path || !this._window) {
      return null;
    }

    if (this._isMain) {
      let intersectionPoint = {};
      let sectorName = "";
      const x1 = this._window.x;
      const x2 = this._window.x + this._window.width;
      const y1 = this._window.y;
      const y2 = this._window.y + this._window.height;
      console.log("win", x1, x2, y1, y2);

      // TODO: changes to portal coordinate conditions
      Object.keys(CALCULATION_MAP).some((sector: Sectors) => {
        const { x, y } = CALCULATION_MAP[sector](this._window, path);
        sectorName = sector;

        // Right
        if (x === x2 && y <= y2 && y >= y1) {
          intersectionPoint = { x, y };
          return true;
        }
        // Left
        if (x === x1 && y <= y2 && y >= y1) {
          intersectionPoint = { x, y };
          return true;
        }
        // Top
        if (y === y1 && x <= x2 && x >= x1) {
          intersectionPoint = { x, y };
          return true;
        }
        // Bottom
        if (y === y2 && x <= x2 && x >= x1) {
          intersectionPoint = { x, y };
          return true;
        }

        return false;
      });
      console.log("intersection", intersectionPoint, sectorName);

      return intersectionPoint;
    }

    return null;
  }

  getIntersectionPoint(): AnimationParams | null {
    const coords = this._calcScreenIntersectionPoint();
    if (!coords || !this._window) {
      return null;
    }

    const { x, y } = coords;

    return {
      x: x - this._window.x,
      y: y - this._window.y,
    };
  }

  update(props: {
    windowParams: WindowParams | null;
    anotherWindowParams: WindowParams | null;
  }) {
    const { windowParams, anotherWindowParams } = props;

    this._window = windowParams;
    this._anotherWindow = anotherWindowParams;
  }
}

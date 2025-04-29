import {WindowParams, Path as IPath, AnimationParams} from "../types.ts";

export class Path {
  private _pX;
  private _pY;
  private _window: WindowParams | null;
  private _anotherWindow: WindowParams | null;
  private _isMain: boolean = false;

  constructor(props: {
    portalPosition: DOMRect,
    windowParams: WindowParams | null,
    anotherWindowParams: WindowParams | null,
    isMain: boolean,
  }) {
    const {
      portalPosition,
      windowParams,
      anotherWindowParams,
      isMain,
    } = props;

    const { x, y} = portalPosition;
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

    return {
      from: {
        x: this._pX + this._anotherWindow.x,
        y: this._pY + this._anotherWindow.y,
      },
      to: {
        x: this._pX + this._window.x,
        y: this._pY + this._window.y,
      },
    };
  }

  private _calcScreenIntersectionPoint(): AnimationParams | null {
    const path = this._calcScreenPortalPath();
    if (!path || !this._window) {
      return null;
    }

    const { from, to } = path;

    if (this._isMain) {
      return {
        x: this._window.x,
        y: (to.y - from.y) * (this._window.x - from.x) / (to.x - from.x) + from.y,
      };
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
      x: x + this._window.x,
      y: y + this._window.y,
    };
  }

  update(props: {
    windowParams: WindowParams | null,
    anotherWindowParams: WindowParams | null,
  }) {
    const {
      windowParams,
      anotherWindowParams,
    } = props;

    this._window = windowParams;
    this._anotherWindow = anotherWindowParams;
  }
}

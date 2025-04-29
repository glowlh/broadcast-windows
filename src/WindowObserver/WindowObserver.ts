import { WindowParams } from "../types.ts";

const STORAGE_WINDOWS_PARAMS_NAME = "WINDOWS";
const STORAGE_WINDOWS_COUNT_NAME = "COUNT";

export class WindowObserver {
  private _interval;
  private _count;

  public id;
  public index;

  constructor() {
    // this._init();
  }

  private _init() {
    this._interval = setInterval(this._store.bind(this), 1000);
    this._count =
      parseInt(localStorage.getItem(STORAGE_WINDOWS_COUNT_NAME), 10) || 0;
    this._count++;
    this.id = `window_${this._count}`;
    this.index = this._count;

    localStorage.setItem(STORAGE_WINDOWS_COUNT_NAME, this._count);

    // TODO: add event for updating storage
    window.addEventListener("beforeunload", () => {
      this._count = localStorage.getItem(STORAGE_WINDOWS_COUNT_NAME) || 0;
      this._count = this._count - 1 < 0 ? 0 : this._count - 1;
      localStorage.setItem(STORAGE_WINDOWS_COUNT_NAME, this._count);

      const storedParams = localStorage.getItem(STORAGE_WINDOWS_PARAMS_NAME);
      const parsedParams = JSON.parse(storedParams);
      delete parsedParams[this.id];
      localStorage.setItem(
        STORAGE_WINDOWS_PARAMS_NAME,
        JSON.stringify(parsedParams),
      );
    });
  }

  private _isEqualParams(currentParams, storedParams) {
    return (
      currentParams.x === storedParams.x &&
      currentParams.y === storedParams.y &&
      currentParams.width === storedParams.width &&
      currentParams.height === storedParams.height
    );
  }

  private _store() {
    const windowParams = this._getWindowParams();

    const storedParams = localStorage.getItem(STORAGE_WINDOWS_PARAMS_NAME);
    let nextStoredParams = {};

    if (storedParams) {
      nextStoredParams = JSON.parse(storedParams);

      if (nextStoredParams[this.id]) {
        if (!this._isEqualParams(windowParams, nextStoredParams[this.id])) {
          nextStoredParams[this.id] = {
            id: this.id,
            ...windowParams,
          };
        } else {
          return;
        }
      } else {
        nextStoredParams[this.id] = {
          id: this.id,
          ...windowParams,
        };
      }
    } else {
      nextStoredParams[this.id] = {
        id: this.id,
        ...windowParams,
      };
    }

    localStorage.setItem(
      STORAGE_WINDOWS_PARAMS_NAME,
      JSON.stringify(nextStoredParams),
    );
  }

  private _getWindowParams(): WindowParams {
    return {
      x: window.screenLeft,
      y: window.screenTop,
      width: window.innerWidth,
      height: window.innerHeight,
      id: this.id,
    };
  }

  private _getParsedWindowParams() {
    const storedParams = localStorage.getItem(STORAGE_WINDOWS_PARAMS_NAME);
    return JSON.parse(storedParams);
  }

  stop() {
    console.info("--stop--");
    clearInterval(this._interval);
  }

  start() {
    this._init();
  }

  clear() {
    console.info("--clear--");
    localStorage.clear();
  }

  getWindowParamsFromStore(): WindowParams | null {
    const parsedStoredParams = this._getParsedWindowParams() || {};

    return parsedStoredParams[this.id] || null;
  }

  getAnotherWindowParamsFromStore(): WindowParams | null {
    const parsedStoredParams = this._getParsedWindowParams();
    let anotherWindowParams = null;

    if (!parsedStoredParams) {
      return null;
    }

    Object.keys(parsedStoredParams).some((key) => {
      if (key !== this.id) {
        anotherWindowParams = parsedStoredParams[key];
        return true;
      }

      return false;
    });

    return anotherWindowParams;
  }

  isMain(): boolean {
    const parsedStoredParams = this._getParsedWindowParams();

    if (!parsedStoredParams) {
      return false;
    }

    const min = 0;
    let minObj: unknown = {};

    Object.entries(parsedStoredParams).map(([, val]) => {
      if (val.index <= min) {
        minObj = val;
      }
    });

    return minObj.id === this.id;
  }
}

import { WindowParams } from "../types.ts";
import { StorageManager } from "../StorageManager";
import { updateWindowEvent } from "../UpdateWindowEvent";

export class WindowObserver {
  private _interval;
  private _count;
  private _storageManager: StorageManager;

  public id;
  public index;

  constructor() {
    // this._init();
    this._storageManager = new StorageManager();
  }

  private _init() {
    this._interval = setInterval(this._store.bind(this), 1000);
    this._count = this._storageManager.getCount();
    this._count++;
    this.id = `window_${this._count}`;
    this.index = this._count - 1;

    this._storageManager.setCount(this._count);

    window.addEventListener("beforeunload", () => {
      this._count = this._storageManager.getCount();
      this._count = this._count - 1 < 0 ? 0 : this._count - 1;

      this._storageManager.setCount(this._count);
      this._storageManager.deleteParamsById(this.id);
      this._storageManager.deleteAnimationForWindow(this.id);
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

    const storedParams = this._storageManager.getParamsAll();
    const nextStoredParams = storedParams || {};

    if (storedParams) {
      if (nextStoredParams[this.id]) {
        if (!this._isEqualParams(windowParams, nextStoredParams[this.id])) {
          nextStoredParams[this.id] = {
            id: this.id,
            index: this.index,
            ...windowParams,
          };
        } else {
          return;
        }
      } else {
        nextStoredParams[this.id] = {
          id: this.id,
          index: this.index,
          ...windowParams,
        };
      }
    } else {
      nextStoredParams[this.id] = {
        id: this.id,
        index: this.index,
        ...windowParams,
      };
    }

    this._storageManager.setParamsAll(nextStoredParams);
    this._storageManager.addAnimationForWindow(this.id);
    window.dispatchEvent(updateWindowEvent);
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

  stop() {
    console.info("--stop--");
    clearInterval(this._interval);
  }

  start() {
    console.info("--start--");
    this._init();
  }

  clear() {
    console.info("--clear--");
    this._storageManager.clearAll();
  }

  getWindowParamsFromStore(): WindowParams | null {
    return this._storageManager.getParamsById(this.id);
  }

  getAnotherWindowParamsFromStore(): WindowParams | null {
    const parsedStoredParams = this._storageManager.getParamsAll();
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

  get isMain(): boolean {
    const parsedStoredParams = this._storageManager.getParamsAll();

    if (!parsedStoredParams) {
      return true;
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

  startAnimation() {
    this._storageManager.setActiveAnimationById(this.id);
  }

  stopAnimation() {
    const anotherWindow = this.getAnotherWindowParamsFromStore();
    if (anotherWindow) {
      this._storageManager.setActiveAnimationById(anotherWindow.id);
    }

    this._storageManager.setInactiveAnimationById(this.id);
  }

  get activeAnimation() {
    return this._storageManager.getActiveAnimation();
  }

  get animationCount() {
    const animations = this._storageManager.getAnimationAll();
    if (!animations) {
      return null;
    }

    return Object.keys(animations).length;
  }
}

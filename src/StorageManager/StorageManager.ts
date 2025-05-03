import { WindowsParamsStorage, WindowParams } from "../types.ts";

export const STORAGE_WINDOWS_PARAMS_NAME = "WINDOWS";
export const STORAGE_WINDOWS_COUNT_NAME = "COUNT";
export const STORAGE_ANIMATION_STATE = "ANIMATION";

export class StorageManager {
  public paramsScope: string;
  public countScope: string;
  public animationScope: string;

  constructor(props?: { params?: string; count?: string; animation?: string }) {
    if (!props) {
      this.paramsScope = STORAGE_WINDOWS_PARAMS_NAME;
      this.countScope = STORAGE_WINDOWS_COUNT_NAME;
      this.animationScope = STORAGE_ANIMATION_STATE;
      return this;
    }

    const { params, count, animation } = props;
    this.paramsScope = params || STORAGE_WINDOWS_PARAMS_NAME;
    this.countScope = count || STORAGE_WINDOWS_COUNT_NAME;
    this.animationScope = animation || STORAGE_ANIMATION_STATE;
  }

  getCount() {
    const storedCount = localStorage.getItem(this.countScope);
    if (!storedCount) {
      return null;
    }

    return Number(storedCount) || 0;
  }

  setCount(count: number) {
    localStorage.setItem(this.countScope, count);
  }

  getParamsAll() {
    const storedParams = localStorage.getItem(this.paramsScope);
    if (!storedParams) {
      return null;
    }

    return JSON.parse(storedParams);
  }

  setParamsAll(params: WindowsParamsStorage) {
    localStorage.setItem(this.paramsScope, JSON.stringify(params));
  }

  getParamsById(id: string) {
    const params = this.getParamsAll();
    if (!params) {
      return null;
    }

    return params[id] || null;
  }

  setParamsById(id: string, params: WindowParams) {
    const paramsAll = this.getParamsAll();
    if (!paramsAll) {
      return null;
    }

    localStorage.setItem(
      this.paramsScope,
      JSON.stringify({
        ...paramsAll,
        id: {
          ...params,
        },
      }),
    );
  }

  deleteParamsById(id: string) {
    const paramsAll = this.getParamsAll();
    if (!paramsAll) {
      return null;
    }

    delete paramsAll[id];
    this.setParamsAll(paramsAll);
  }

  clearAll() {
    localStorage.clear();
  }

  getAnimationAll() {
    const animations = localStorage.getItem(this.animationScope);
    if (!animations) {
      return null;
    }

    return JSON.parse(animations);
  }

  getActiveAnimation(): null | string {
    const animations = this.getAnimationAll();
    if (!animations) {
      return null;
    }

    let activeId = null;
    Object.entries(animations).some(([key, value]) => {
      if (value) {
        activeId = key;
        return true;
      }

      return false;
    });

    return activeId;
  }

  setActiveAnimationById(id: string) {
    const animations = this.getAnimationAll();
    if (!animations) {
      return null;
    }

    for (const key in animations) {
      animations[key] = key === id;
    }

    localStorage.setItem(this.animationScope, JSON.stringify(animations));
  }

  setInactiveAnimationById(id: string) {
    const animations = this.getAnimationAll();
    if (!animations) {
      return null;
    }

    animations[id] = false;
    localStorage.setItem(this.animationScope, JSON.stringify(animations));
  }

  addAnimationForWindow(id: string) {
    const animations = this.getAnimationAll() || {};
    if (!animations[id]) {
      animations[id] = false;
      localStorage.setItem(this.animationScope, JSON.stringify(animations));
    }
  }

  deleteAnimationForWindow(id: string) {
    const animations = this.getAnimationAll();
    if (!animations) {
      return null;
    }

    delete animations[id];
    localStorage.setItem(this.animationScope, JSON.stringify(animations));
  }
}

import { Storage, WindowParams } from "../types.ts";

const STORAGE_WINDOWS_PARAMS_NAME = "WINDOWS";
const STORAGE_WINDOWS_COUNT_NAME = "COUNT";

export class StorageManager {
  public paramsScope: string;
  public countScope: string;

  constructor(props?: { params?: string; count?: string }) {
    if (!props) {
      this.paramsScope = STORAGE_WINDOWS_PARAMS_NAME;
      this.countScope = STORAGE_WINDOWS_COUNT_NAME;
      return this;
    }

    const { params, count } = props;
    this.paramsScope = params || STORAGE_WINDOWS_PARAMS_NAME;
    this.countScope = count || STORAGE_WINDOWS_COUNT_NAME;
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

  setParamsAll(params: Storage) {
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
}

const STORAGE_WINDOWS_PARAMS_NAME = 'WINDOWS';
const STORAGE_WINDOWS_COUNT_NAME = 'COUNT';

export class WindowObserver {

  private _interval;
  private _count;

  public id;

  constructor() {
    this._init();
  }

  _init() {
    this._interval = setInterval(this._store.bind(this), 1000);
    this._count = parseInt(localStorage.getItem(STORAGE_WINDOWS_COUNT_NAME), 10) || 0;
    this._count++;
    this.id = `window_${this._count}`;

    localStorage.setItem(STORAGE_WINDOWS_COUNT_NAME, this._count);

    window.addEventListener('beforeunload', () => {
      console.log('unload');
      this._count = localStorage.getItem(STORAGE_WINDOWS_COUNT_NAME) || 0;
      this._count = this._count - 1 < 0 ? 0 : this._count - 1;
      localStorage.setItem(STORAGE_WINDOWS_COUNT_NAME, this._count);

      const storedParams = localStorage.getItem(STORAGE_WINDOWS_PARAMS_NAME);
      const parsedParams = JSON.parse(storedParams);
      delete parsedParams[this.id];
      localStorage.setItem(STORAGE_WINDOWS_PARAMS_NAME, JSON.stringify(parsedParams));
    });
  }

  _isEqualParams(currentParams, storedParams) {
    return currentParams.x === storedParams.x &&
      currentParams.y === storedParams.y &&
      currentParams.width === storedParams.width &&
      currentParams.height === storedParams.height;
  }

  _store() {
    const windowParams = this._getWindowParams();

    const storedParams = localStorage.getItem(STORAGE_WINDOWS_PARAMS_NAME);
    let nextStoredParams = {};

    if (storedParams) {
      nextStoredParams = JSON.parse(storedParams);

      if (nextStoredParams[this.id]) {
        if (!this._isEqualParams(windowParams, nextStoredParams[this.id])) {
          nextStoredParams[this.id] = {
            id: this.id,
            ...windowParams
          };
        } else {
          return;
        }
      } else {
        nextStoredParams[this.id] = {
          id: this.id,
          ...windowParams
        };
      }
    } else {
      nextStoredParams[this.id] = {
        id: this.id,
        ...windowParams,
      }
    }

    localStorage.setItem(STORAGE_WINDOWS_PARAMS_NAME, JSON.stringify(nextStoredParams));
  }

  _getWindowParams() {
    return {
      x: window.screenLeft,
      y: window.screenTop,
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  stop() {
    console.info('--stop--');
    clearInterval(this._interval);
  }

  clear() {
    console.info('--clear--');
    localStorage.clear();
  }
}
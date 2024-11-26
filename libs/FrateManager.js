//#region 関数・型定義

/**
 * {@link FrateManager} 内部で利用する専用
 * @see https://i.imgur.com/mBPLpfm.jpg 状態遷移図
 * @private
 */
function _createInnerFrate() {
  return {
    /**
     * 押されているか
     */
    pressed: false,
    /**
     * `pressed`は直前のフレームで変更されたか
     */
    isNow: false,
    /**
     * 次のフレームで`pressed`の状態を反転するか
     * @internal これは {@link FrateManager} 内部で利用するためのプロパティです
     */
    _switch: false,
    /**
     * 次の次のフレームで`pressed`の状態を反転するか
     * @internal これは {@link FrateManager} 内部で利用するためのプロパティです
     */
    _nextSwitch: false,
  };
}

/**
 * {@link FrateManager} で利用する状態
 * @private
 * @typedef {ReturnType<_createInnerFrate>} _InnerFrate
 */
/**
 * {@link FrateManager} で利用する状態の定義
 * @typedef {Omit<_InnerFrate, "_switch" | "_nextSwitch">} Frate 
 */

//#endregion 関数・型定義


/**
 * フレーム中に受信したイベントをフレーム更新時に状態に反映するクラス\
 * フレーム更新時に {@link FrateManager.update} を呼び出すことで、新しい状態に更新できる
 */
class FrateManager {
  /**
   * @type {Record<string, _InnerFrate>}
   */
  _map = {};

  /**
   * 条件に合うキーの状態を取得します
   * @param {(key: Frate) => boolean} filter 取得するキーの条件
   * @returns {Record<string, Frate>} 条件に一致するキーのみの状態
   */
  getFilterdKeys(filter) {
    /** @type {Record<string, Frate>} */
    const keys = {};

    // ここの key はキーボードのキーではなく、
    // オブジェクトの key\value のキー
    for (const key in this._map) {
      const value = this._map[key];
      if (filter(value)) {
        keys[key] = {
          isNow: value.isNow,
          pressed: value.pressed
        };
      }
    }

    return keys;
  }

  /**
   * 現在のフレームの値を取得します
   * @param {string} key 取得する値のキー
   * @returns {Frate}
   */
  get(key) {
    let state = this._map[key];
    if (state != null) {
      return {
        pressed: state.pressed,
        isNow: state.isNow,
      };
    }

    state = this._map[key] = _createInnerFrate();

    return {
      pressed: state.pressed,
      isNow: state.isNow,
    };
  }

  /**
   * キーの状態を更新する
   * @param {string} key 変化するキー
   * @param {boolean} isPress 押し込みか
   */
  handleEvent(key, isPress) {
    const state = this._map[key] ?? _createInnerFrate();
    if (state.pressed !== isPress) {
      state._switch = true;
      state._nextSwitch = false;
    } else if (state._switch) {
      state._nextSwitch = true;
    }

    this._map[key] = state;
  }

  /**
   * フレームを更新する
   */
  update() {
    //@ts-ignore
    for (const [key, state] of Object.entries(this._map)) {
      if (state._switch) {
        state.pressed = !state.pressed;
        state.isNow = true;
      } else {
        state.isNow = false;
      }

      state._switch = state._nextSwitch;
      state._nextSwitch = false;
    }
  }
}

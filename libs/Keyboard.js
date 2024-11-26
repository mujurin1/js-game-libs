/**
 * キーボードに関連する情報を取得します
 */
const keyboard = (() => {
  let manager = new FrateManager();

  document.addEventListener("keydown", ev => {
    if (keyboard.isPrevent) ev.preventDefault();
    manager.handleEvent(ev.code, true);
  });
  document.addEventListener("keyup", ev => {
    if (keyboard.isPrevent) ev.preventDefault();
    manager.handleEvent(ev.code, false);
  });

  // MEMO: altKey ctrlKey metaKey shiftKey

  return {
    /**
     * キー入力の伝播を防ぐかどうか
     */
    isPrevent: false,

    /**
     * キーの状態を取得する
     * @param {string} key 取得するキー
     * @returns {Frate}
     */
    getState: key => {
      return manager.get(key);
    },
    /**
     * キーが押されているか
     * @param {string} key 判定するキー
     * @returns {boolean}
     */
    isDown: key => {
      const state = manager.get(key);
      return state.pressed;
    },
    /**
     * キーが押されているか\
     * (このフレームがキーを押し始めた最初のフレームか)
     * @param {string} key 判定するキー
     * @returns {boolean}
     */
    isDownNow: key => {
      const state = manager.get(key);
      return state.pressed && state.isNow;
    },
    /**
     * キーボードの状態を更新します\
     * `GameLoop`内で呼び出されているため呼び出し不要です
     */
    update: () => {
      manager.update();
    },

    /**
     * 今押されているキーみの状態を一覧で取得する
     * @returns {{[key: string]: Frate}} 押されているキーの状態
     */
    getDownKeys: () => {
      return manager.getFilterdKeys(key => key.pressed);
    },
  };
})();


/**
 * @typedef FrameState
 * @property {number} tick 前回のフレームからの経過時間 (ミリ秒)
 * @property {number} timestamp ページが読み込まれてからの経過時間 (秒)
 */

/**
 * ゲームループ関係
 */
const gameLoop = (() => {
  let oldTimestamp = 0;
  /**
   * １フレーム毎に呼ばれる関数
   * @type {(state: FrameState) => void}
   */
  let oneFramedFn;

  const _this = {
    /**
     * ゲームループを開始します
     * @param {typeof oneFramedFn} frameFn 1フレーム毎に呼ばれる関数
     */
    start: (frameFn) => {
      oneFramedFn = frameFn;
      window.requestAnimationFrame(loop);
    },
  };

  return _this;

  /**
   * @param {number} timestamp
   */
  function loop(timestamp) {
    const tick = (timestamp - oldTimestamp);
    oldTimestamp = timestamp;

    mouse.update();
    keyboard.update();

    oneFramedFn({ tick, timestamp });

    window.requestAnimationFrame(loop);
  }
})();


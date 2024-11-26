/**
 * マウスに関連する情報を取得します
 */
const mouse = (() => {
  //#region 次のフレームまでの間に発生した各マウスイベント時のマウスの座標
  /**
   * (最後に発生したマウスイベント時の) マウスの座標
   * @type {{ x:number, y: number } | undefined}
   */
  let _lastPoint;
  /**
   * マウスが動いたか
   * @type {boolean}
   */
  let _move = false;
  /**
   * 最後に発生したイベントがDownか\
   * 一度も発生していない場合は`undefined`
   * @type {boolean | undefined}
   */
  let _lastIsDown;
  /**
   * 最後に発生したDownイベント時の座標\
   * 一度も発生していない場合は出鱈目な値
   * @type {{ x: number, y: number }}
   */
  let _downPoint;
  /**
   * 最後に発生したUpイベント時の座標\
   * 一度も発生していない場合は出鱈目な値
   * @type {{ x: number, y: number }}
   */
  let _upPoint;
  //#endregion 次のフレームまでの間に発生した各マウスイベント時のマウスの座標

  canvas.addEventListener("mousemove", ev => {
    _lastPoint = { x: ev.offsetX, y: ev.offsetY };
    _move = true;
  });
  canvas.addEventListener("mousedown", ev => {
    _lastPoint = _downPoint = { x: ev.offsetX, y: ev.offsetY };
    _lastIsDown = true;
  });
  canvas.addEventListener("mouseup", ev => {
    _lastPoint = _upPoint = { x: ev.offsetX, y: ev.offsetY };
    _lastIsDown = false;
  });

  //#region フレームで固定する各マウスイベント時のマウスの座標
  /** @type {{ x:number, y: number } | undefined} */
  let _framedDownPoint = undefined;
  /** @type {{ x:number, y: number } | undefined} */
  let _framedUpPoint = undefined;
  /** @type {{ x:number, y: number }} */
  let _framedPoint = { x: 0, y: 0 };
  //#endregion フレームで固定する各マウスイベント時のマウスの座標

  // このフレームでの値
  let _frameDownNow = false;
  let _frameMoveNow = false;
  let _frameUpNow = false;

  return {
    /** クリックしているか */
    get isDown() {
      return _framedDownPoint != null;
    },
    /**
     * このフレームでクリックしたか\
     * (このフレームがクリックを開始したフレームか)
     */
    get isDownNow() {
      return _frameDownNow;
    },
    /** このフレームでクリックを離したか */
    get isUpNow() {
      return _frameUpNow;
    },
    /**
     * このフレームでマウスが動いたか\
     * １フレーム内でマウスが移動して１フレーム前と同じ位置に戻った場合も`true`になる
     */
    get isMoveNow() {
      return _frameMoveNow;
    },
    /**
     * クリックした時の座標\
     * クリックを離していない場合に値が存在する
     * (`undefined`でない)
     * @returns {{x: number, y: number} | undefined}
     */
    get downedPoint() {
      return _framedDownPoint;
    },
    /**
     * マウスの座標
     * (実際には最後に反応があった時のマウスの座標)
     *
     * 画面外のマウスの動きは反映されない
     * @returns {{x: number, y: number}}
     */
    get point() {
      return _framedPoint;
    },
    /**
     * マウスの状態を更新します\
     * `GameLoop`内で呼び出されているため呼び出し不要です
     * @returns {void}
     */
    update: () => {
      _frameDownNow = false;
      _frameMoveNow = _move;
      _frameUpNow = false;

      if (_lastPoint != null) {
        _framedPoint = _lastPoint;
      }

      if (_lastIsDown != null) {
        if (_framedDownPoint == null) {
          if (_lastIsDown) {
            _frameDownNow = true;
            _framedDownPoint = _downPoint;
            _framedUpPoint = undefined;
            _lastIsDown = undefined;
          } else if (_downPoint != null) {
            _frameDownNow = true;
            _framedDownPoint = _downPoint;
            _framedUpPoint = undefined;
          }
        } else {
          if (!_lastIsDown) {
            _frameUpNow = true;
            _framedUpPoint = _upPoint;
            _framedDownPoint = undefined;
            _lastIsDown = undefined;
          } else if (_upPoint != null) {
            _frameUpNow = true;
            _framedUpPoint = _upPoint;
            _framedDownPoint = undefined;
          }
        }
      }

      _move = false;
      _lastPoint = undefined;
    },
  };
})();

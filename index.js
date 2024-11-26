gameLoop.start(
  state => {
    logic(state);
    draw(state);
  });


let cellX = 300;
let cellY = 300;
/** セルが1秒間に動くピクセル数 */
let cellSpeed = 100;
let cellSize = 50;

/**
 * @param {FrameState} state
 */
function logic(state) {
  if (keyboard.isDown("KeyW"))
    cellY -= cellSpeed * state.tick / 1000;
  if (keyboard.isDown("KeyS"))
    cellY += cellSpeed * state.tick / 1000;
  if (keyboard.isDown("KeyA"))
    cellX -= cellSpeed * state.tick / 1000;
  if (keyboard.isDown("KeyD"))
    cellX += cellSpeed * state.tick / 1000;

  // 最初にクリックした瞬間だけ座標を動かす
  if (mouse.isDownNow) {
    cellX = mouse.downedPoint.x;
    cellY = mouse.downedPoint.y;
  }
}

/**
 * @param {FrameState} state
 */
function draw(state) {
  let textX = 30;
  const textY = 10;
  const lineSpace = 30;

  context.fillStyle = "steelblue";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.font = "25px Arial";
  context.fillStyle = "black";

  // const fps = Math.round(1 / secondsPassed);

  context.fillStyle = "black";
  // context.fillText("FPS: " + fps, 10, 30);
  context.fillText(`Tick: ${state.tick}`, textY, textX += lineSpace);
  context.fillText(`Time: ${Math.floor(state.timestamp / 1000)}`, textY, textX += lineSpace);
  context.fillText(`Mouse (X: ${mouse.point.x}, Y: ${mouse.point.y})`, textY, textX += lineSpace);
  context.fillText(`Cell (X: ${Math.floor(cellX)}, Y: ${Math.floor(cellY)})`, textY, textX += lineSpace);
  // context.fillText(`CellSize ${cellSize}`, textY, textX += lineSpace);
  // エンターキーを押したフレームのみ
  context.fillText(`Press Enter Now: ${keyboard.isDownNow("Enter")}`, textY, textX += lineSpace);

  // 円を描く
  context.fillStyle = "coral";
  // 円の中心座標: (cellX, cellY)
  // 半径: 50
  // 開始角度: 0度 (0 * Math.PI / 180)
  // 終了角度: 360度 (360 * Math.PI / 180)
  // 方向: true=反時計回りの円、false=時計回りの円
  context.arc(cellX, cellY, cellSize, 0 * Math.PI / 180, 360 * Math.PI / 180, false);
  // 塗りつぶしを実行
  context.fill();

  //線をリセット
  context.beginPath();
}
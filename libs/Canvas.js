const GAME_W = 600;
const GAME_H = 600;

/** @type {HTMLCanvasElement} */
// @ts-ignore
const canvas = document.getElementById("canvas");
/** @type {CanvasRenderingContext2D} */
// @ts-ignore
const context = canvas.getContext("2d");

canvas.width = GAME_W;
canvas.height = GAME_H;

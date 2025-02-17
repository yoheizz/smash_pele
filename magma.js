import { config as cfg } from "./config.js";
import * as uti  from "./utils.js";
import { ctx } from "./canvas.js";
import { Player } from "./player.js";
import { autoPlayer } from "./cpu.js";
import { Box } from "./box.js";
import * as gov  from "./gameover.js";
import * as dead from "./deadlist.js"

export const drawMagma = () => {
  ctx.fillStyle = "red";
  for (let i = 0; i < cfg.CANVAS_W; i++) {
    const waveOffset = Math.sin((i + performance.now() / 50) * 0.5) * cfg.MAGMA_WAVE;
    ctx.fillRect(i, cfg.CANVAS_H - cfg.MAGMA_H + waveOffset, 1, 50); // 波の動き
  }
};
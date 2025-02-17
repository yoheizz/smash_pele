import { config as cfg } from "./config.js";
import * as uti from "./utils.js";
import { ctx } from "./canvas.js";
import { Player } from "./player.js";
import { autoPlayer } from "./cpu.js";
import { Box } from "./box.js";
import * as gov from "./gameover.js";
import * as dead from "./deadlist.js";
import { drawMagma } from "./magma.js";

const delay=(ms)=> {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const restartGame = () => {
  loop();
};
const loop = async () => {
  await delay(cfg.FPS);
  loop();
};

window.onload = () => {
  loop();
};

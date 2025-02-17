import { config as cfg } from "./config.js";
import { ctx } from "./canvas.js";
import { Player } from "./player.js";
import { autoPlayer } from "./cpu.js";
import { Box } from "./box.js";
import * as gov  from "./gameover.js";
import * as dead from "./deadlist.js"

export const gameOver = () => {
    ctx.fillStyle = 'black'
    ctx.font = '80px Arial';
    ctx.fillText(`勝者: ${cfg.WINNER} `, cfg.CANVAS_W*0.2, cfg.CANVAS_H*0.5);
    ctx.fillText(`タイム${cfg.GAME_TIME}秒 `, cfg.CANVAS_W*0.2, cfg.CANVAS_H*0.7);
    document.getElementById("restart").style.display = "initial";
    document.getElementById("buttonG").style.display = "none";
  };
   
  export const checkGameover = (player) => {
    dead.setDeadlist(player);
    if (!player.isCpu && player.y >= cfg.CANVAS_H*3) {
        cfg.isGameOver = true;
        cfg.WINNER = "CPU";
        player.getTime();
    } else if (player.isCpu && dead.getAliveCPUs() === 0) {
        cfg.isGameOver = true;
        cfg.WINNER = "YOU";
        player.getTime();
    }
  };

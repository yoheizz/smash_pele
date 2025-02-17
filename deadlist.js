import { config as cfg } from "./config.js";
import * as uti  from "./utils.js";
import { ctx } from "./canvas.js";

export const drawDeadArea = () => {
    ctx.fillStyle = 'rgba(128, 128, 128, 0.5)';
    ctx.fillRect(0, 0, cfg.CANVAS_W, cfg.DEADLIST_H);
  };
  
  export const getAliveCPUs = () => {
    return cfg.ALL_PLAYERS.filter(player => !player.isDead && player.isCpu).length;
  };
  
  export const setDeadlist = (player) => {
    if (player.isCpu && player.y >= cfg.CANVAS_H && !player.isDead) {
      player.isDead = true;
      cfg.DEAD_LIST.push(player);
      player.dead();
    }
  };
  
  export const displayAliveCPUs = (aliveCPUs) => {
    ctx.fillStyle = 'black';
    ctx.font = '40px Arial';
    ctx.fillText(`残りのCPU: ${aliveCPUs}`, 40, cfg.DEADLIST_H/3);
    ctx.fillText(`ボックス数: ${cfg.BOX_COUNT}`,500, cfg.DEADLIST_H/3);
  };
  
import { ctx , updateCamera , drawMiniMap ,clearAndsetArea} from "./canvas.js";
import { config as cfg } from "./config.js";
import * as uti from "./utils.js";
import { Player } from "./player.js";
import { startAutoPlayerLoop } from "./cpu.js";
import { Box } from "./box.js";
import { Item } from "./item.js";
import * as gov from "./gameover.js";
import * as dead from "./deadlist.js";
import { drawMagma } from "./magma.js";

cfg.createPlayers();
cfg.createBoxes();

const loop = () => {
  if (cfg.isGameOver) {
    gov.gameOver();
    return;
  }
  clearAndsetArea();
  cfg.createItems();
  
  cfg.ALL_ITEMS.forEach(item => {
    item.draw();
    item.update();
    cfg.ALL_PLAYERS.forEach(player =>{
      uti.checkItem(player,item);
    })
    cfg.BOXES.forEach(box =>{
      uti.checkCollision(item, box);
    })
  })
  
  cfg.ALL_PLAYERS.forEach(player => {
    player.draw();
    player.update();
    gov.checkGameover(player);
    player.smashs.forEach(smash=>{
      cfg.ALL_PLAYERS.forEach(otherplayer=>{
        if(player!==otherplayer){
          uti.checkSmash(otherplayer,smash);
        }
      })
    });
  });
  
  cfg.BOXES.forEach(box => {
    box.draw();
    box.update();
    cfg.ALL_PLAYERS.forEach(player => {
      uti.checkCollision(player, box);
    });
  });
  
  uti.checkLock();
  updateCamera(cfg.ALL_PLAYERS[0],cfg.ALL_PLAYERS[1]);
  startAutoPlayerLoop(cfg.ALL_PLAYERS[0],cfg.ALL_PLAYERS[1]);
  drawMiniMap();
  cfg.LOOP_ID = requestAnimationFrame(loop);
};

window.onload = () => {
  document.getElementById("restart").addEventListener("click", restartGame);
  uti.checkDisplay();
  requestAnimationFrame(loop);
};

const restartGame = () => {
  if (cfg.LOOP_ID) {
    cancelAnimationFrame(cfg.LOOP_ID);
    cfg.LOOP_ID = null;
  }
  cfg.ALL_PLAYERS.forEach(player => { player.restart(); });
  cfg.BOXES.forEach(box => { box.restart(); });
  cfg.ALL_ITEMS = [];
  cfg.DEAD_LIST = [];
  cfg.isGameOver = false;
  cfg.BOX_COUNT = 0;
  cfg.ITEM_COUNT = 0

  uti.checkDisplay();
  document.getElementById("restart").style.display = "none";
  cfg.LOOP_ID = requestAnimationFrame(loop);
};


import { config as cfg } from "./config.js";
import { ctx } from "./canvas.js";
import { Player } from "./player.js";
import { autoPlayer } from "./cpu.js";
import { Box } from "./box.js";
import * as gov  from "./gameover.js";
import * as dead from "./deadlist.js"
import { Smash } from "./smash.js";

export const getRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getDistance = (A, B) => {
  return Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
};

export const getColor = () => {
  const r = getRandom(0, 255);
  const g = getRandom(0, 255);
  const b = getRandom(0, 255);
  return `rgb(${r}, ${g}, ${b})`;
};

export const drawTrajectory = (A, targetBox = null, color) => {
    let tempX = A.x;
    let tempY = A.y;
    let tempVx = A.vx;
    let tempVy = A.vy;
    let tempVg = A.vg;
    
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(tempX + A.width / 2, tempY + A.height / 2);
  
    for (let i = 0; i < 30; i++) {
      tempVy += tempVg;
      tempX += tempVx;
      tempY += tempVy;
  
      if (targetBox) {
        // targetBox がある場合は一度だけ線を引く
        ctx.lineTo(targetBox.x + A.width / 2, targetBox.y + A.height / 2);
        break;
      } else {
        // 通常の未来軌跡
        ctx.lineTo(tempX + A.width / 2, tempY + A.height / 2);
      }
    }
    ctx.stroke();
  };
  
export const checkCollision = (player, box) => {
    if(player.isDead||box.isDead)return;
    if (
      player.x + player.width > box.x &&
      player.x < box.x + box.width &&
      player.y + player.height > box.y &&
      player.y < box.y + box.height &&
      player.vy >= 0
    ) {
      player.y = box.y - player.height;
      player.vy = 0;
      player.isJumping = false;
      player.isBoxID = box.id;
    };
  };

  export const checkSmash = (player, smash) => {
    if (player.isDead || smash.isDead) return;

    if(getDistance(player,smash)<player.width){
        if(player.x > smash.x){
          player.isLeft = false;
        }else if(player.x<smash.x){
          player.isLeft = true;
        }
        player.isHit = true;
      }
  };
  

export const checkItem = (player, item) => {
  if(player.isItem)return;
  if (
    player.x + player.width > item.x &&
    player.x < item.x + item.width &&
    player.y + player.height > item.y &&
    player.y < item.y + item.height &&
    player.vy >= 0
  ) {
    player.isItem = true;
    player.isThrowing = false;
    player.item = item;  // アイテムを取得して持つ
    item.x = player.x;  
    item.y = player.y - item.height
  };
};

export const checkDisplay = () => {
  const isLandscape = window.innerWidth > window.innerHeight;
  if (isLandscape) {
    document.getElementById('buttonG').style.display = 'none';
    const canvas = document.getElementById('canvas');
    canvas.style.width = '80%';
    canvas.style.height = '50%';
  } else {
    document.getElementById('buttonG').style.display = 'initial';
  }
};
 
export const checkLock = () => {
  let startTime;
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      startTime = performance.now();
    } else if (document.visibilityState === 'visible') {
      startTime = performance.now();
    }
  });
};


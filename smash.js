import { ctx , updateCamera , drawMiniMap} from "./canvas.js";
import { config as cfg } from "./config.js";
import * as uti from "./utils.js";
import { Player } from "./player.js";
import { autoPlayer } from "./cpu.js";
import { Box } from "./box.js";
import { Item } from "./item.js";
import * as gov from "./gameover.js";
import * as dead from "./deadlist.js";
import { drawMagma } from "./magma.js";

export class Smash {
  constructor(x, y,isLeft) {
      this.x = x;
      this.y = y;
      this.width = 15;
      this.height = 15;
      this.vx = 1;
      this.vy = 0;
      this.speed = cfg.SMASH_SPEED;
      this.isDead = false;
      this.startX = x;
      this.distance = 0;
      this.maxDistance = cfg.S_MAX_DISTANCE;
      this.isLeft = isLeft;
  }

  update() {
    if(this.isDead)return;
      const leftFactor = this.isLeft ? -1 : 1;
      this.x += this.speed * leftFactor*this.vx;
      this.y -= this.vy;
      this.distance = Math.abs(this.x - this.startX);
      if (this.distance > this.maxDistance) {
        this.isDead = true;
      };
  }

  draw() {
      if (this.isDead) return;
      ctx.fillStyle = "tomato";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2);
      ctx.fill();
  }
}

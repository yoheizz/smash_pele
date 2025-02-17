import { config as cfg } from "./config.js";
import * as uti  from "./utils.js";
import { ctx } from "./canvas.js";

export class Box {
    static boxID = 0;
    constructor(x,y,width,height,isMove,speed,up) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.speed = speed;
      this.up = up;
      this.number = cfg.BOX_COUNT++;
      this.color = "gray";
      this.startTime = performance.now();
      this.initialx = this.x;
      this.initialy = this.y;
      this.isMove = isMove;
      this.id = Box.boxID; 
      Box.boxID++;
    }
  
    draw() {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.fillStyle = 'black';
      ctx.font = '40px Arial';
      ctx.fillText(this.id,this.x,this.y-10);
      }
  
    update() {
      this.move();
    }
    
    splice() {
      if (this.x + this.width < 0 || this.y + this.height < 0) {
        cfg.BOXES = cfg.BOXES.filter(box => box !== this);
      }
    }    

    move(){
      const elapsedTime = (performance.now() - this.startTime) / 1000;
      this.x += Math.cos(elapsedTime) * this.speed;
      this.y += Math.sin(elapsedTime) * this.up;
    }

    restart(){
      this.x = this.initialx;
      this.y = this.initialy;
      this.startTime = performance.now(); 
    }
};
  
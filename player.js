  import { config as cfg } from "./config.js";
  import * as uti  from "./utils.js";
  import { ctx } from "./canvas.js";
  import { Smash } from "./smash.js";

  export class Player {
      static playerID = 0;
      constructor(x,y,name,cpu) {
        this.x = x;
        this.y = cfg.P_START_y;
        this.width = cfg.PLAYER_W;
        this.height =cfg.PLAYER_H;
        this.vx = 0;
        this.vy = 0;
        this.vg = cfg.P_GRAVITY;
        this.jumpStrength = cfg.P_JUMP_STRENGTH;
        this.isJumping = false;
        this.speed = cfg.P_SPEED;
        this.startTime = performance.now();
        this.color = cpu ? uti.getColor() : "hotpink";
        this.name = name ?? "CPU";
        this.isDead = false;
        this.isCpu = cpu ?? true;
        this.elapsedTime = cfg.P_ELAPSED_TIME;
        this.initialx = this.x;
        this.initialy = this.y
        this.isItem = null;
        this.item = null;
        this.isSmash = false;
        this.isSmashTimeout = false;
        this.smashTime = cfg.P_SMASH_TIME;
        this.smashs = [];
        this.isLeft = false;
        this.isHit = false;
        this.hitStrength = cfg.P_HIT_STRENGTH;
        this.life = cfg.P_LIFE;
        this.id = Player.playerID; 
        Player.playerID++;
        this.isBoxID = null;

        if(!this.isCpu){
          document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') {
              this.leftMove();
            } else if (event.key === 'ArrowRight') {
              this.rightMove();
            } else if (event.key === 'ArrowUp') {
              this.upMove();
            } else if (event.key === 'ArrowDown') {  // 下キー追加
              this.smashMove();
            }
          });
          document.addEventListener('keyup', (event) => {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
              this.keyup();
            }else if(event.key === 'ArrowDown'){
            }
          });
          const buttonHandlers = {
            'Jump': () => this.upMove(),
            'Left': () => this.leftMove(),
            'Right': () => this.rightMove(),
            'Smash':() => this.smashMove(),
          };
          Object.keys(buttonHandlers).forEach(buttonId => {
            const button = document.getElementById(buttonId);
            button.addEventListener('touchstart', buttonHandlers[buttonId]);
          });
          document.addEventListener('touchend', () => this.keyup());
        }
      }
      
      draw() {
          ctx.fillStyle = 'black';
          ctx.font = '40px Arial';
          ctx.fillText(this.name,this.x,this.y-10);

          ctx.fillStyle = this.color;
          ctx.fillRect(this.x, this.y, this.width, this.height);
          if(this.isLeft){
            this.drawLeft();
          }else{
            this.drawRight();
          };
        }
      
      update() {
        this.elapasedMove();
        this.smashs = this.smashs.filter(smash => !smash.isDead);
        this.smashs.forEach(smash => {
          smash.update();
          smash.draw();
        });
        this.hit();
      }

      elapasedMove(){
        if(this.isDead)return;
        const currentTime = performance.now();
        const elapsedTimeInSeconds = (currentTime - this.startTime) / 1000;
        if (elapsedTimeInSeconds >= this.elapsedTime) {
          this.vy += this.vg;
          this.x += this.vx;
          this.y += this.vy;
        } else {
          this.vx = 0;
          this.vy = 0;
        }
      }
      dead() {
          if(!this.isDead)return;
          this.resetPosition();
      }
      
      resetPosition() {
        this.x = cfg.CANVAS_W - (100 * cfg.DEAD_LIST.length);
        this.y = cfg.DEADLIST_H-this.height*1.1;
      }
    
      restart(){
        this.x = this.initialx;
        this.y = this.initialy;
        this.vx = 0;
        this.vy = 0;
        this.isJumping = false;
        this.isDead = false;
        this.startTime = performance.now(); 
        this.smashs = [];
        if(this.isCpu)this.color = uti.getColor();
      }
      getTime(){
        cfg.GAME_TIME = ((performance.now() - this.startTime) / 1000).toFixed(2);
      }
      leftMove(){
        this.vx = -this.speed;
        this.isLeft = true;
      }
      rightMove(){
        this.vx = this.speed;
        this.isLeft = false;
      }
      upMove(){
        if(!this.isJumping){
        this.vy = this.jumpStrength;
        this.isJumping = true;
        this.isBoxID = null;
        }
      }
      keyup(){
        this.vx = 0;
      }

      smashMove() {
        if(this.isSmashTimeout)return;
        this.isSmashTimeout = true;
        const smash = new Smash(this.x + this.width / 2, this.y + this.height/2,this.isLeft);
        this.smashs.push(smash);
        setTimeout(() => {
          this.isSmashTimeout = false;
        }, this.smashTime);
      }
      drawRight(){
        ctx.fillStyle = "black"
        ctx.fillRect(this.x + 15, this.y + 5, this.width / 5, this.height / 5);
        ctx.fillRect(this.x + this.width - 10, this.y + 5, this.width / 5, this.height / 5);
        ctx.fillRect(this.x + 15, this.y + this.height - 15, this.width - 20, this.height / 5);
      }
      drawLeft(){
        ctx.fillStyle = "black"
        ctx.fillRect(this.x +5, this.y + 5, this.width / 5, this.height / 5);
        ctx.fillRect(this.x + this.width - 20, this.y + 5, this.width / 5, this.height / 5);
        ctx.fillRect(this.x + 5, this.y + this.height - 15, this.width - 20, this.height / 5);
      }
      hit(){
        if(!this.isHit)return;
        const leftFactor = this.isLeft ? -1 : 1;
        this.vx += this.hitStrength * leftFactor;
        this.vy = -this.hitStrength;
        this.isHit = false
      }
  };
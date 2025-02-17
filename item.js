import { config as cfg } from "./config.js";
import * as uti  from "./utils.js";
import { ctx } from "./canvas.js";
import { Player } from "./player.js";

export class Item {
    constructor(mode) {
      this.x = uti.getRandom(100,600);
      this.y = uti.getRandom(100,600);
      this.width = 10;
      this.height = 10;
      this.startTime = performance.now();
      this.color = "red";
      this.speed = 10;
      this.vg = cfg.P_GRAVITY;
      this.mode = mode;
      this.vx = 0;
      this.vy = 0;
    }
  
    draw() {
      this.checkMode();
      }
  
    update() {
      this.delete();  
      this.move();
    }
    
    delete(){
        if (cfg.ALL_ITEMS.length > 5) {
            cfg.ALL_ITEMS = cfg.ALL_ITEMS.filter(item => item !== this);
            cfg.ITEM_COUNT = 0;
        }
    }

    splice() {
      if (this.x + this.width < 0 || this.y + this.height < 0) {
        cfg.ALL_ITEMS = cfg.ALL_ITEMS.filter(item => item !== this);
      }
    }

    move(){
        this.vy += this.vg;
        this.x += this.vx;
        this.y += this.vy;
    }

    checkMode() {
      switch (this.mode) {
        case 0:
            let color = "cyan"; // ← 色を決める
            let length = 100;   // ← 刃の長さ

            // ライトセーバーの刃
            ctx.shadowBlur = 20;
            ctx.shadowColor = color;
            ctx.strokeStyle = color;
            ctx.lineWidth = 15;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x, this.y - length);
            ctx.stroke();

            //持ち手
            ctx.shadowBlur = 0;
            ctx.fillStyle = "black";
            ctx.fillRect(this.x - 10, this.y, 20, 40);
            this.width = 0;//当たり判定よう
            this.height = 40;
          break;
        case 1:
             // ハンマーの描画
             this.width = 0;  // ハンマーの幅
             this.height = 70;  // ハンマーの高さ
 
             // ハンマーのヘッド
             ctx.fillStyle = "black";
             ctx.fillRect(this.x - 50, this.y - 70, 100, 70);  // ヘッド部分
 
             // ハンマーの持ち手
             ctx.fillStyle = "brown";
             ctx.fillRect(this.x - 10, this.y, 20, 70);  // 持ち手部分
          break;
          case 2:
            // TNT爆弾の描画
            let bombWidth = 80;   // TNTの幅
            let bombHeight = 80;  // TNTの高さ
        
            // TNTのボディ
            ctx.fillStyle = "brown";  // 赤色で描画
            ctx.fillRect(this.x - bombWidth / 2, this.y - bombHeight, bombWidth, bombHeight);  // TNTの矩形部分
        
            // TNTのトップ部分（装飾）
            ctx.fillStyle = "black";  // 黒色
            ctx.fillRect(this.x - bombWidth / 2, this.y - bombHeight - 10, bombWidth, 10);  // トップ部分
        
            // TNTのラベル
            ctx.fillStyle = "white";  // 白色でラベル
            ctx.font = "25px Arial";
            ctx.fillText("TNT", this.x - bombWidth / 4, this.y - bombHeight + 20);  // TNTという文字
        
            // 当たり判定の設定
            this.width = 0;
            this.height = 1;
          break;
        
    }}

    restart(){
      cfg.ALL_ITEMS=[];
    }
};
  
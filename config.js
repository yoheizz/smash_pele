import * as uti from "./utils.js";
import { ctx } from "./canvas.js";
import { Player } from "./player.js";
import { autoPlayer } from "./cpu.js";
import { Box } from "./box.js";
import * as gov from "./gameover.js";
import * as dead from "./deadlist.js";
import { drawMagma } from "./magma.js";
import { Item } from "./item.js";
import { Smash } from "./smash.js";

export const config = {
    CANVAS_W : 800,
    CANVAS_H : 800,
    CANVAS_TOP : 150,
    CANVAS_SIZE : 4000,

    FPS : 1000/60,
    LOOP_ID : null,
    GAME_TIME : 0,
    isGameOver : false,
    DEADLIST_H : 150,
    DEAD_LIST : [],
    WINNER : '',
    REBONE_TIME : 5,
    
    ALL_PLAYERS : [],
    IAM_PLAYERS : 1,
    PLAYER_W : 40,
    PLAYER_H : 40,
    P_ELAPSED_TIME : 0,
    P_GRAVITY : 0.5,
    P_JUMP_STRENGTH : -20,
    P_SPEED : 15,
    P_START_y : 600,
    P_SMASH_TIME : 500,
    P_HIT_STRENGTH : 20,
    P_LIFE : 100,

    SMASH_SPEED : 20,
    S_MAX_DISTANCE : 800,
    
    CPU_TYPE :['slowest','nearest','fastest','highest','all'],
    CPU_LEVEL :0.9,

    BOXES : [],
    BOX_COUNT : 0,
    BOX_LEVEL : 10,
    BOX_COLORS : ["brown","blue", "green", "purple", "orange", "gold"],

    ALL_ITEMS : [],
    ITEM_COUNT :0,
    
    MAGMA_H : 1600,
    MAGMA_WAVE : 100,

    createPlayers : function(){
        this.ALL_PLAYERS =[
            new Player(100, 100 ,'YOU', false),
            new Player(800, 500 ,'CPU',true),
            // new Player(3 * 100, this.P_START_y ,'',true),
            // new Player(4 * 100, this.P_START_y ,'',true),
            // new Player(5 * 100, this.P_START_y ,'',true),
            // new Player(6 * 100, this.P_START_y ,'',true),
        ]
    },

    createBoxes : function(){
        this.BOXES = [
            new Box(0, 700, 1400, 80, false, 0, 0),   // 地面っぽい大きな足場
            new Box(60, 500, 300, 20, true, 3, 0),    // 右に動く小さい足場
            new Box(600, 100, 100, 20, true, -2, 0),  // 左に動く小さい足場
            new Box(80, 300, 100, 20, true, 1, 1),    // 斜めに動く足場
            new Box(500, 400, 200, 20, true, 0, 1),   // 上下に動く足場
            new Box(200, 200, 100, 20, true, 1, 1),   // 斜めに動く足場
            new Box(-200, -100, 150, 20, true, 2, 0), // 画面外（左上）
            new Box(-500, -300, 120, 20, true, 0, 2), // 画面外（さらに左上）
            new Box(900, -200, 150, 20, true, -1, 1), // 画面外（右上）
            new Box(1200, 800, 200, 20, true, -2, 0), // 画面外（遠く右下）
            new Box(-1000, 500, 180, 20, true, 1, -1), // 画面外（遠く左下）
            new Box(-800, 600, 150, 20, true, 3, 1),  // 画面外（左下）
            new Box(1000, -100, 200, 20, true, -3, 0), // 画面外（右上）
            new Box(1300, -400, 120, 20, true, -1, -1), // 画面外（右上）
            new Box(-700, -400, 100, 20, true, 1, 2),  // 画面外（左上）
            new Box(-1300, 300, 150, 20, true, 0, 3),  // 画面外（左下）
            new Box(1100, 500, 200, 20, true, -2, 0),  // 画面外（右中）
            new Box(1500, 200, 180, 20, true, -1, -2), // 画面外（遠く右中）
            new Box(-1200, 100, 200, 20, true, 2, 0),  // 画面外（遠く左中）
            new Box(-1500, -700, 150, 20, true, 1, 3),  // 画面外（極左上）
            new Box(1700, 700, 200, 20, true, -3, 1),  // 画面外（極右下）
            new Box(-2000, 400, 150, 20, true, 2, 2)   // 画面外（極左下）
        ];        
    },

    createItems : function(){
        if (uti.getRandom(0,100) === 0) {
          this.ALL_ITEMS.push(new Item(uti.getRandom(0,3)));
          config.ITEM_COUNT++;
        }
    },
};

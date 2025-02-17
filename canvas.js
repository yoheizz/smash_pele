import { config as cfg } from "./config.js";
import * as uti from "./utils.js";
import { Player } from "./player.js";
import { autoPlayer } from "./cpu.js";
import { Box } from "./box.js";
import { Item } from "./item.js";
import * as gov from "./gameover.js";
import * as dead from "./deadlist.js";
import { drawMagma } from "./magma.js";

    export const canvas = document.getElementById('canvas');
    export const ctx = canvas.getContext('2d');
    canvas.width = cfg.CANVAS_W;
    canvas.height = cfg.CANVAS_H;

    export const clearAndsetArea = () =>{
        const size = cfg.CANVAS_SIZE;
        ctx.clearRect(-size, -size, size*2, size*2);
        ctx.strokeStyle = "black";
        ctx.strokeRect(-size,-size,size*2,size*2);
    };

    export const updateCamera = (player1,player2) => {
        const MIN_SCALE = 0.1;  // 最小倍率
        const MAX_SCALE = 2;  // 最大倍率
        const BASE_DISTANCE = 400;  // この距離を基準に拡大・縮小
        const ZOOM_SPEED = 0.8;  // ズームのスムーズさ
        let currentScale = 1;

        // プレイヤー間の距離を計算
        const distance = uti.getDistance(player1,player2);

        // 距離に基づいてスケールを調整
        let targetScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, BASE_DISTANCE / distance));
        
        // ズームをスムーズに補間
        currentScale += (targetScale - currentScale) * ZOOM_SPEED;

        // 2人の中心点を求める
        const centerX = (player1.x + player2.x) / 2;
        const centerY = (player1.y + player2.y) / 2;

        // Canvasの拡大縮小
        ctx.setTransform(currentScale, 0, 0, currentScale, canvas.width / 2 - centerX * currentScale, canvas.height / 2 - centerY * currentScale);
        // drawMiniMap();
    };


    export const drawMiniMap = () => {
        const miniMapSize = 150;  // ミニマップのサイズ
        const miniMapX = canvas.width - miniMapSize - 10;  // 右下に配置
        const miniMapY = canvas.height - miniMapSize - 10;

        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);  // カメラの影響をリセット

        // **ミニマップ用の描画領域をクリア**
        ctx.clearRect(miniMapX, miniMapY, miniMapSize, miniMapSize);

        // 背景（透明度あり）
        ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        ctx.fillRect(miniMapX, miniMapY, miniMapSize, miniMapSize);

        // ミニマップのスケール
        const scale = miniMapSize / cfg.CANVAS_W;
        
        ctx.save();
        ctx.translate(miniMapX, miniMapY); // ワイプの位置へ移動
        ctx.scale(scale, scale); // ワイプ用に縮小

        // **ゲーム内オブジェクトをミニマップに描画（0,0の範囲だけ）**
        ctx.beginPath();
        ctx.rect(0, 0, cfg.CANVAS_W, cfg.CANVAS_H);
        ctx.clip(); // キャンバスの範囲だけ描画
        ctx.clearRect(0, 0, cfg.CANVAS_W, cfg.CANVAS_H); // 余計なものを消す

        cfg.BOXES.forEach(box => box.draw());
        cfg.ALL_PLAYERS.forEach(player => player.draw());
        cfg.ALL_ITEMS.forEach(item => item.draw());

        ctx.restore();

        // ワイプの枠
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.strokeRect(miniMapX, miniMapY, miniMapSize, miniMapSize);

        ctx.restore();
};

    
    
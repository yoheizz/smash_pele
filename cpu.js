import { config as cfg } from "./config.js";
import * as uti  from "./utils.js";
import { Player } from "./player.js";

const moveTotarget = (cpu, target) => {
  if(cpu.isHit)return;
  cpu.x < target.x ? cpu.isLeft = false : cpu.isLeft = true;
  if (Math.abs(cpu.vx) > 0.25) { cpu.vx *= 0.5; }

  const deltaX = target.x - cpu.x;
  const deltaY = target.y - cpu.y;

  if (deltaX > 10) {
    cpu.rightMove();
  } else if (deltaX < 10) {
    cpu.leftMove();
  }

  if (deltaY < 0 && !cpu.isJumping) {
    cpu.upMove();
  }
  if (deltaY > 0) {
    // 特に下の処理はここでは必要ないので、空にしておく
  }
  if (Math.abs(cpu.x - targetBox.x) < 10 && Math.abs(cpu.y - targetBox.y) < 10) {
    cpu.vx=0;
  }
};


const smashCpu = (cpu, player) => {
  let distanceToPlayer = uti.getDistance(cpu, player);
  if (distanceToPlayer < cfg.S_MAX_DISTANCE) {
    cpu.smashMove();
  }
};

const getSecondBox = (player) => {
  const sortedBoxes = cfg.BOXES
    .filter(box => box.id !== player.isBoxID)
    .sort((a, b) => {
      const distanceA = Math.abs(a.x - player.x) + Math.abs(a.y - player.y);
      const distanceB = Math.abs(b.x - player.x) + Math.abs(b.y - player.y);
      return distanceA - distanceB;
    });
  return sortedBoxes[0];
};

export const autoPlayer2 = (player, cpu) => {
  if(cpu.isHit)return;
  let distanceToPlayer = uti.getDistance(cpu, player);
  smashCpu(cpu, player);
  let candidatesBox = player;

  if (player.isBoxID === null) {
    moveTotarget(cpu, player);
  } else if (distanceToPlayer < cfg.S_MAX_DISTANCE || player.isBoxID === cpu.isBoxID) {
    candidatesBox = cfg.BOXES.find(box => box.id === player.isBoxID);
    moveTotarget(cpu, candidatesBox);
  } else {
    candidatesBox = getSecondBox(player);
    moveTotarget(cpu, candidatesBox);
    cpu.smashs.forEach(smash => {
      smash.vx = 0;
      smash.vy = 30;
      smash.width = 30;
    });
  }
};

export const startAutoPlayerLoop = (player, cpu) => {
  const loop = async () => {
    await autoPlayer2(player, cpu); // 非同期処理の場合
    setTimeout(loop, 1000); // 1000ミリ秒後に再実行
  };
  
  loop(); // 初回の実行
};












export const autoPlayer = (player, cpu, mode,rank) => {
    if (cfg.BOXES.length === 0) return;
  
    // 候補となるボックスを取得（基本条件）
    let candidates = cfg.BOXES.filter(box => 
      box.x >= cfg.CANVAS_W*0.2 && box.x <= cfg.CANVAS_W*0.9 && //200 750
      box.y <= cfg.CANVAS_H*0.9 && box.width >= 30 && //700 30
      box.speed < cpu.speed * 1.5 &&  //1.5
      Math.abs(box.x - cpu.x) < cfg.CANVAS_W*0.5 // 極端に遠すぎるボックスを除外
    );
  
    if (candidates.length === 0) candidates = cfg.BOXES; // 条件を満たすボックスがなければ全ボックスを候補に
  
    // 最遅のボックスを選択
    let slowestBox = candidates.reduce((slowest, box) => 
      box.speed < slowest.speed ? box : slowest
    , candidates[0]);
  
    // 最高速度のボックスを選択
    let fastestBox = candidates.reduce((fastest, box) => 
      box.speed > fastest.speed ? box : fastest
    , candidates[0]);
  
    // もっとも上のボックスを選択
    let highestBox = candidates.reduce((highest, box) => 
      box.y < highest.y ? box : highest
    , candidates[0]);
  
    // プレイヤーに最も近いボックスを選択
    let nearestBox = candidates.reduce((nearest, box) => 
      uti.getDistance(cpu, box) < uti.getDistance(cpu, nearest) ? box : nearest
    , candidates[0]);
  
    // プレイヤーとCPUの近接度やターゲット選択を強化する
    let targetBox;
    switch (mode) {
      case "slowest":
        targetBox = slowestBox;
        break;
      case "fastest":
        targetBox = fastestBox;
        break;
      case "highest":
        targetBox = highestBox;
        break;
      case "nearest":
        targetBox = nearestBox;
        break;
      case "all":
      default:
      // **スコアリングを強化**
      let scoredBoxes = candidates.map(box => {
      let score = 0;
      let distance = uti.getDistance(cpu, box);
      let playerDistance = uti.getDistance(player, box);
  
      // 遅いボックスを高評価
      score -= Math.abs(box.speed-0.5) * 4;//引く数字が優先速度　
      // 高いボックスを優先
      score -= box.y * 2;
      // 右側を優先
      score += box.x * 0.3;
      // プレイヤーに近いボックスを優先
      score -= playerDistance * 0.6;
  
      // CPUの進行方向をより最適化
      if (cpu.x < box.x) score += 1;
      if (cpu.y > box.y) score += 1;
  
      return { box, score };
      });
  
      // スコアが最も高いボックスを選択
      scoredBoxes.sort((a, b) => b.score - a.score);
      targetBox = scoredBoxes[0]?.box || player;
      break;
    }
  
    // **最適化: 第2候補の考慮**
    if (uti.getDistance(cpu, targetBox) > 300) {
      targetBox = nearestBox;
    }
  
    // **ジャンプ処理を強化**
    if (!cpu.isJumping && targetBox.y < cpu.y) {
      let jumpStrength = Math.min(Math.abs(targetBox.y - cpu.y) * 0.6, cpu.jumpStrength);
      cpu.vy = jumpStrength;
      cpu.isJumping = true;
    }
  
    // **移動処理の最適化**
    let moveDirection = cpu.x < targetBox.x ? 1 : -1;
    const speedFactor = rank;  // 移動速度を上げて強化 0.8がいいくらい
    cpu.vx += moveDirection * speedFactor;
    if (Math.abs(cpu.vx) > 0.25) cpu.vx *= 0.90; // 速度が出過ぎたら減速 0.9
  
    // **目標に近づいたらターゲット変更**
    if (Math.abs(cpu.x - targetBox.x) < 10 && Math.abs(cpu.y - targetBox.y) < 10) {
      targetBox = nearestBox;
    }
  
    // **落下防止処理**
    if (!cpu.isJumping && cpu.y > cfg.CANVAS_H*0.98) {
      targetBox = player;
      cpu.up();
    }
  };
  
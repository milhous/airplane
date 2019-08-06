/*
 * 流程相关系统
 * BattleStartSystem - 开始
 * CollisionDetectionSystem - 碰撞检测
 */
import BattleStartSystem from '../game/systems/battle-start.system.js';
import CollisionDetectionSystem from '../game/systems/collision-detection.system.js';

/*
 * 玩家相关系统
 * PlayerMovementSystem - 移动
 */ 
import PlayerMovementSystem from '../game/systems/player-movement.system.js';

/*
 * 敌方相关系统
 * EnemySpawnSystem - 组装
 */ 
import EnemySpawnSystem from '../game/systems/enemy-spawn.system.js';
import EnemyMovementSystem from '../game/systems/enemy-movement.system.js';

/*
 * 火力相关系统
 * OpenFireSystem - 开火
 * AmmoMovementSystem - 弹药移动
 */
import OpenFireSystem from '../game/systems/open-fire.system.js';
import AmmoMovementSystem from '../game/systems/ammo-movement.system.js';

/*
 * 渲染相关系统
 * RenderSystem - 渲染
 */
import RenderSystem from '../game/systems/render.system.js';

export default {
    BattleStartSystem,
    PlayerMovementSystem,
    EnemySpawnSystem,
    EnemyMovementSystem,
    OpenFireSystem,
    AmmoMovementSystem,
    CollisionDetectionSystem,
    RenderSystem
};
/*
 * 流程相关系统
 * BattleStartSystem - 开始
 */
import BattleStartSystem from './systems/battle-start.system.js';
/*
 * 玩家相关系统
 * PlayerMovementSystem - 移动
 */ 
import PlayerMovementSystem from './systems/player/player-movement.system.js';

/*
 * 渲染相关系统
 * RenderSystem - 渲染
 */
import RenderSystem from './systems/render.system.js';

export default {
    BattleStartSystem,
    PlayerMovementSystem,
    RenderSystem
};
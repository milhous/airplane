/*
 * 渲染
 * renderPlayer - 玩家
 * renderAmmo - 弹药
 * renderEnemy - 敌方
 */
import renderPlayer from '../game/render/player.render.js';
import renderAmmo from '../game/render/ammo.render.js';
import renderEnemy from '../game/render/enemy.render.js';

export default {
    player: renderPlayer,
    ammo: renderAmmo,
    enemy: renderEnemy
};
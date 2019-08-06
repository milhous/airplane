// Systems
import Systems from 'systems.game.js';
// Components
import Components from 'components.game.js';

/*
 * 缓动（每帧移动一段距离）
 * @param {object} startPoint 起点
 * @param {object} endPoint 终点
 * @param {number} speed 速度
 * @return {object} result 
 */
export function tween(startPoint, endPoint, speed) {
    const startX = startPoint.x;
    const startY = startPoint.y;
    const endX = endPoint.x;
    const endY = endPoint.y;

    let x = 0;
    let y = 0;

    // 缓动效果
    const offsetX = endX - startX > 0 ? speed : -speed;
    const offsetY = endY - startY > 0 ? speed : -speed;

    x += startX + offsetX;
    y += startY + offsetY;

    if ((offsetX > 0 && x > endX) || (offsetX < 0 && x < endX)) {
        x = endX;
    }

    if ((offsetY > 0 && y > endY) || (offsetY < 0 && y < endY)) {
        y = endY;
    }

    return {
        x,
        y
    }
};
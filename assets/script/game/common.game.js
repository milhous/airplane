// Systems
import Systems from 'systems.game.js';
// Components
import Components from 'components.game.js';

/*
 * 缓动（每帧移动一段距离）
 * @param {number} x x轴位置
 * @param {number} y y轴位置
 * @param {boolean} isDestroy 是否达到目标位置销毁
 * @param {number} eid 实体ID
 * @param {number} ename 实体名称 
 */
export function move({
    x,
    y,
    isDestroy = false,
    eid,
    ename
}) {
    const entity = ecs.entityManager.get(ename, eid);

    if (!entity) {
        return;
    }

    const entityPosition = entity.getComp(Components.Position);
    const entityTween = entity.getComp(Components.Tween);

    entity.setCompsState(Components.Position, {
        x,
        y
    });

    if (entityPosition.x === entityTween.x && entityPosition.y === entityTween.y) {
        entity.setCompsState(Components.Tween, {
            enabled: false
        });

        if (isDestroy) {
            entity.setCompsState(Components.Owner, {
                enabled: false
            });
        }
    }
};
// 公共
import * as common from '../common.game.js';
// 组件
import Components from '../components.game.js';

// 敌人移动
export default class EnemyMovementSystem extends ecs.System {
    static get name() {
        return 'EnemyMovementSystem';
    }

    constructor() {
        super();
    }

    onLoad() {
        // 缓动
        this._ecs.workerManager.open('Math', 'tween', (data) => {
            if (data.ename !== 'Enemy') {
                return;
            }

            data.isDestroy = true;

            common.move(data);
        });
    }

    onUpdate() {
        this.updateEntity();
    }

    onReceive(data) {}

    // 更新
    updateEntity() {
        const enemyMap = this._ecs.entityManager.getMap('Enemy');

        if (!enemyMap || enemyMap.size === 0) {
            return;
        }

        for (const enemyEntity of enemyMap.values()) {
            const enemyTween = enemyEntity.getComp(Components.Tween);

            if (enemyTween.enabled) {
                const enemyPosition = enemyEntity.getComp(Components.Position);

                const start = {
                    x: enemyPosition.x,
                    y: enemyPosition.y
                };
                const end = {
                    x: enemyTween.x,
                    y: enemyTween.y
                };
                const speed = enemyTween.speed;

                this._ecs.workerManager.send('Math', {
                    cmd: 'tween',
                    preload: {
                        start,
                        end,
                        speed,
                        ename: enemyEntity.name,
                        eid: enemyEntity.id
                    }
                });
            }
        }
    }
}
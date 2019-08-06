// 公共
import * as common from '../common.game.js';
// 组件
import Components from '../components.game.js';

export default class CollisionDetectionSystem extends ecs.System {
    static get name() {
        return 'CollisionDetectionSystem';
    }

    constructor() {
        super();
    }

    onLoad() {
        // 缓动
        this._ecs.workerManager.open('Math', 'collisionDetection', (data) => {
            this.collision(data);
        });
    }

    onUpdate() {
        this.updateEntity();
    }

    onReceive(data) {}

    // 更新
    updateEntity() {
        const enemyMap = this._ecs.entityManager.getMap('Enemy');
        const ammoMap = this._ecs.entityManager.getMap('Ammo');

        if (!enemyMap || enemyMap.size === 0 || !ammoMap || ammoMap.size === 0) {
            return;
        }

        const selfColliders = new Map();
        const otherColliders = new Map();

        for (const enemyEntity of enemyMap.values()) {
            const enemyPosition= enemyEntity.getComp(Components.Position);
            const enemyShape = enemyEntity.getComp(Components.Shape);

            selfColliders.set(enemyEntity.id, {
                name: enemyEntity.name,
                x: enemyPosition.x,
                y: enemyPosition.y,
                width: enemyShape.width,
                height: enemyShape.height
            });
        }

        for (const ammoEntity of ammoMap.values()) {
            const ammoPosition= ammoEntity.getComp(Components.Position);
            const ammoShape = ammoEntity.getComp(Components.Shape);

            otherColliders.set(ammoEntity.id, {
                name: ammoEntity.name,
                x: ammoPosition.x,
                y: ammoPosition.y,
                width: ammoShape.width,
                height: ammoShape.height
            });
        }

        this._ecs.workerManager.send('Math', {
            cmd: 'collisionDetection',
            preload: {
                selfColliders,
                otherColliders
            }
        });
    }

    // 碰撞
    collision(data) {
        for (const [ename, eids] of data.entries()) {
            for (const eid of eids) {
                const entity = ecs.entityManager.get(ename, eid);

                if (!entity) {
                    return;
                }

                entity.setCompsState(Components.Tween, {
                    enabled: false
                });

                entity.setCompsState(Components.Owner, {
                    enabled: false
                });
            }
        }
    }
}
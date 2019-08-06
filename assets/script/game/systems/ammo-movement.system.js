// 公共
import * as common from '../common.game.js';
// 组件
import Components from '../components.game.js';

export default class AmmoMovementSystem extends ecs.System {
    static get name() {
        return 'AmmoMovementSystem';
    }

    constructor() {
        super();
    }

    onLoad() {
        // 缓动
        this._ecs.workerManager.open('Math', 'tween', (data) => {
            if (data.ename !== 'Ammo') {
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

    /*
     * 更新
     * @param {object} data 数据
     */
    updateEntity() {
        const ammoMap = this._ecs.entityManager.getMap('Ammo');

        if (!ammoMap || ammoMap.size === 0) {
            return;
        }

        for (const ammoEntity of ammoMap.values()) {
            const ammoTween = ammoEntity.getComp(Components.Tween);

            if (ammoTween.enabled) {
                const ammoPosition = ammoEntity.getComp(Components.Position);

                const start = {
                    x: ammoPosition.x,
                    y: ammoPosition.y
                };
                const end = {
                    x: ammoTween.x,
                    y: ammoTween.y
                };
                const speed = ammoTween.speed;

                this._ecs.workerManager.send('Math', {
                    cmd: 'tween',
                    preload: {
                        start,
                        end,
                        speed,
                        ename: ammoEntity.name,
                        eid: ammoEntity.id
                    }
                });
            }
        }
    }
}
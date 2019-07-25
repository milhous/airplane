// 组件
import Components from '../components.game.js';

export default class OpenFireSystem extends ecs.System {
    static get name() {
        return 'OpenFireSystem';
    }

    constructor() {
        super();
    }

    onLoad() {

    }

    onUpdate() { }

    /*
     * @param {object} data 炮弹数据
     * @param {string} type 炮弹类型
     */
    onReceive(data) {
        
    }

    /*
     * 组装弹药实体
     * @param {string} id ID
     * @param {number} damage 伤害
     * @param {number} model 型号
     * @param {object} position 位置
     */
    spawnAmmoEntity({
        id,
        damage,
        model,
        position
    }) {
        const ammoOwner = new Components.Owner(id, true);
        const ammoProp = new Components.ammoProp({
            damage,
            model
        });
        const ammoPosition = new Components.Position(position.x, position.y);
        const ammoTween = new Components.Tween({ x: 0, y: 0 });

        const ammoEntity = new ecs.Entity('Ammo')
            .addComp(ammoOwner)
            .addComp(ammoProp)
            .addComp(ammoPosition)
            .addComp(ammoTween);
    }
}
// 公共
import * as common from '../common.game.js';
// 组件
import Components from '../components.game.js';

export default class EnemySpawnSystem extends ecs.System {
    static get name() {
        return 'EnemySpawnSystem';
    }

    constructor() {
        super();
    }

    onLoad() {

    }

    onUpdate() {}

    onReceive(data) {
        this.spawnEnemyEntity(data);
    }

    /*
     * 组装敌方实体
     * @param {string} id ID
     * @param {number} healthPoint 当前血量
     * @param {number} maxHealthPoint 最大血量
     * @param {number} model 型号
     * @param {number} width 宽度
     * @param {number} height 高度
     * @param {number} x x轴位置
     * @param {number} y y轴位置
     * @param {number} speed 移动速度
     */
    spawnEnemyEntity({
        id,
        name,
        level,
        healthPoint,
        maxHealthPoint,
        model,
        width,
        height,
        x,
        y,
        speed
    }) {
        const worldEntity = this._ecs.entityManager.first('World');
        const worldShape = worldEntity.getComp(Components.Shape);

        const enemyOwner = new Components.Owner(id, true);
        const enemyProp = new Components.BasicsProp({
            name,
            level,
            healthPoint,
            maxHealthPoint,
            model
        });
        const enemyShape = new Components.Shape({
            width,
            height
        });
        const enemyPosition = new Components.Position(x, y);
        const enemyTween = new Components.Tween({ 
            x,
            y: -height,
            enabled: true,
            speed
        });

        const enemyEntity = new ecs.Entity('Enemy')
            .addComp(enemyOwner)
            .addComp(enemyProp)
            .addComp(enemyShape)
            .addComp(enemyPosition)
            .addComp(enemyTween);
    }
}
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
        const playerOwner = new Components.Owner(id, true);
        const playerProp = new Components.PlayerProp({
            name,
            level,
            healthPoint,
            maxHealthPoint,
            model
        });
        const playerShape = new Components.Shape({
            width,
            height
        });
        const playerPosition = new Components.Position(x, y);
        const playerTween = new Components.Tween({ 
            x: 0,
            y: 0,
            speed: 20
        });

        const playerEntity = new ecs.Entity('Player')
            .addComp(playerOwner)
            .addComp(playerProp)
            .addComp(playerShape)
            .addComp(playerPosition)
            .addComp(playerTween);
    }
}
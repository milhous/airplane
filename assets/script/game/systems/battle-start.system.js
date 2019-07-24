// 组件
import Components from '../components.game.js';

// 对战开始
export default class BattleStartSystem extends ecs.System {
    static get name() {
        return 'BattleStartSystem';
    }

    constructor() {
        super();
    }

    onLoad() {}

    onUpdate() {}

    onReceive(data) {
        this.spawnPlayerEntity(data.player);
    }

    /*
     * 组装玩家实体
     * @param {string} id ID
     * @param {string} name 姓名
     * @param {number} level 等级
     * @param {number} healthPoint 当前血量
     * @param {number} maxHealthPoint 最大血量
     * @param {number} model 型号
     * @param {object} position 位置
     */
    spawnPlayerEntity({
        id,
        name,
        level,
        healthPoint,
        maxHealthPoint,
        model,
        position,
    }) {
        const playerOwner = new Components.Owner(id, true);
        const playerProp = new Components.PlayerProp({
            name,
            level,
            healthPoint,
            maxHealthPoint,
            model
        });
        const playerPosition = new Components.Position(position.x, position.y);
        const playerTween = new Components.Tween({ x: 0, y: 0 });

        const playerEntity = new ecs.Entity('Player')
            .addComp(playerOwner)
            .addComp(playerProp)
            .addComp(playerPosition)
            .addComp(playerTween);
    }
}
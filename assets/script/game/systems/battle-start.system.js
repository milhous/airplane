// 组件
import Components from '../../game/components.game.js';
// 通用
import * as common from '../../game/common.game.js';

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
        this.spawn(data);
    }

    /* 
     * 组装
     * @param {array} players 玩家数据
     * @param {object} mapSize 地图尺寸
     */
    spawn({
        battleId,
        players,
        mapSize,
        roundTotalNum,
        myRoleId,
        myCamp,
        moveVit,
        dieTextList,
        cameraWidth,
        cameraHeight,
        gameMode
    }) {
        // 组装世界实体
        this.spawnWorldEntity(battleId, mapSize, roundTotalNum, myRoleId, myCamp, moveVit, dieTextList, gameMode);
        
        // 组装轨迹实体
        common.spawnTracks(this._ecs, battleId);

        players.map((player) => {
            this.spawnPlayerEntity(player);

            common.spawnWeaponEntity(player.roleId, player.weapon);

            if (player.roleId === myRoleId) {
                // 组装技能实体
                this.spawnSkillEntity(player.skill_info, false);

                // 组装大招实体
                this.spawnSuperEntity(myRoleId, player.ang);
            }
        });

        // 组装摄像机
        common.spawnCamera(this._ecs, cameraWidth, cameraHeight);

        // 移动摄像机
        common.moveCamera(this._ecs, {
            x: mapSize.width / 2,
            y: mapSize.height / 2
        });
    }

    /*
     * 组装世界实体
     * @param {string} battleId 对战ID
     * @param {object} mapSize 地图尺寸
     */
    spawnWorldEntity(battleId, mapSize, roundTotalNum, myRoleId, myCamp, moveVit, dieTextList,gameMode) {
        const environment = new Components.Environment({ battleId, roundTotalNum, myRoleId, myCamp, moveVit, dieTextList, mapWidth: mapSize.width, mapHeight: mapSize.height,gameMode });
        const physics = new Components.Physics();
        const shape = new Components.Shape({
            width: mapSize.width,
            height: mapSize.height
        });

        const worldEntity = new ecs.Entity('World')
            .addComp(environment)
            .addComp(physics)
            .addComp(shape);
    }

    /*
     * 组装玩家实体
     * @param {object} player 玩家数据
     */
    spawnPlayerEntity(player) {
        const worldEntity = this._ecs.entityManager.first('World');
        const environment = worldEntity.getComp(Components.Environment);

        const playerOwner = new Components.Owner(player.roleId, true);
        const playerProp = new Components.PlayerProp({
            name: player.name,
            sex: player.sex,
            level: player.level,
            fashion: player.fashion,
            weapon: player.weapon,
            healthPoint: player.imageResources === '12511' ? 0 : player.hp,
            maxHealthPoint: player.imageResources === '12511' ? 0 : player.hp,
            actionPoint: player.vit,
            maxActionPoint: player.vit,
            anger: player.ang,
            camp: player.camp,
            roleType: player.role_type,
            imageResources: player.imageResources
        });

        const playerPosition = new Components.Position(player.point[1], player.point[0]);
        const playerTransform = new Components.Transform({
            angle: player.angle,
            direction: player.direct
        });
        const playerTween = new Components.Tween({ x: 0, y: 0 });
        const playerDamage = new Components.Damage();

        const playerEntity = new ecs.Entity('Player')
            .addComp(playerOwner)
            .addComp(playerProp)
            .addComp(playerPosition)
            .addComp(playerTransform)
            .addComp(playerTween)
            .addComp(playerDamage);
    }

    /*
     * 组装技能实体
     * @param {array} data 技能数据
     * @param {boolean} isActive 是否激活
     */
    spawnSkillEntity(data, isActive) {
        const skills = [];
        const props = [];

        data.map((obj) => {
            if (Number(obj.skill_no) < 1004) {
                props.push(obj);
            } else {
                skills.push(obj);
            }
        });

        while (skills.length < 3) {
            skills.push({});
        }

        const arr = skills.concat(props);

        arr.map(({ skill_no, name, desc, vit, percent }, index) => {
            const type = Number(skill_no) < 1004 ? 1 : 0;

            const skillOwner = new Components.Owner(skill_no);
            const skillProp = new Components.SkillProp({
                cd: isActive ? percent : 1,
                name,
                desc,
                actionPoint: vit,
                type,
                index
            });

            const skillEntity = new ecs.Entity('Skill')
                .addComp(skillOwner)
                .addComp(skillProp);
        });
    }

    /*
     * 组装技能实体
     * @param (number) ang 怒气值
     */
    spawnSuperEntity(id,ang) {
        const superOwner = new Components.Owner(id);
        const superProp = new Components.SuperProp({
            anger: ang,
        });

        const superEntity = new ecs.Entity('Super')
                .addComp(superOwner)
                .addComp(superProp);
    }

}
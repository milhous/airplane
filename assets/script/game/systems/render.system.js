// 组件
import Components from '../components.game.js';
// 渲染
import render from '../render.game.js';

// 渲染
export default class RenderSystem extends ecs.System {
    static get name() {
        return 'RenderSystem';
    }

    constructor() {
        super();
    }

    onLoad() { }

    onUpdate(dt) {
        const dirtyMap = this._ecs.entityManager.getDirty();
        const entitysMap = new Map();

        if (dirtyMap.size) {
            for (const [tag, comps] of dirtyMap.entries()) {

                const data = tag.split('@');
                const entityName = data[0];
                const entityId = data[1];

                const entity = this._ecs.entityManager.get(entityName, entityId);

                if (!!entity) {
                    if (!entitysMap.has(entityName)) {
                        entitysMap.set(entityName, new Map());
                    }

                    const entitys = entitysMap.get(entityName);

                    entitys.set(entity, comps);
                }
            }

            if (entitysMap.size) {
                for (const [entityName, entitys] of entitysMap) {
                    const funName = `update${entityName}UI`;

                    if (entitys.size && this.__proto__.hasOwnProperty(funName)) {
                        this[funName](entitys);

                        entitys.clear();
                    }
                }

                entitysMap.clear();
            }
        }
    }

    onReceive({
        time
    }) {
        // 跳过回合
        const worldEntity = this._ecs.entityManager.first('World');
        const environment = worldEntity.getComp(Components.Environment);
        // 试炼模式切回合发送的是progressNextRound
        if(environment.gameMode == 'courage'){
            this.progressNextRound(time);
        }else{
            this.nextRound(time);
        }
    }

    // 切换回合
    nextRound(time = 0) {
        const worldEntity = this._ecs.entityManager.first('World');
        const environment = worldEntity.getComp(Components.Environment);

        const playerEntity = this._ecs.entityManager.find('Player', Components.Owner, { 'id': environment.actId });

        if (playerEntity) {
            const playerProp = playerEntity.getComp(Components.PlayerProp);

            /*
             * 如果当前行动是自己或者是机器人，切换回合
             * playerProp.roleType 1: 玩家, 2: 机器人, 3: 怪兽
             */
            if (environment.myRoleId === environment.actId || playerProp.roleType > 1) {
                this._ecs.ui.sendSocketMsg({
                    cmd: ACTION.NEXT_ROUND,
                    data: {
                        roundNum: environment.roundNum,
                        actId: environment.actId
                    }
                }, time);
            }
        }
    }

    // 试炼模式切换回合是PROGRESS_NEXT_ROUND
    progressNextRound(time = 0) {
        const worldEntity = this._ecs.entityManager.first('World');
        const environment = worldEntity.getComp(Components.Environment);

        // 发送PROGRESS_NEXT_ROUND
        this._ecs.ui.sendSocketMsg({
            cmd: ACTION.PROGRESS_NEXT_ROUND,
            data: {
                roundNum: environment.roundNum
            }
        }, time);
    }
    /*
     * 开火
     * @param {object} data 数据
     */
    openFire(data) {
        this._ecs.ui.sendSocketMsg({
            cmd: ACTION.SHOOT,
            data
        });
    }

    /*
     * 检查组件是否存在
     * @param {array} comp 组件名
     * @param {array} comps 组件名称列表
     * @return {boolean} result 是否存在
     */
    hasComps(comp, comps) {
        if (Array.isArray(comp)) {
            const result = comp.filter((name) => {
                const index = comps.findIndex((val) => {
                    return val.indexOf(name) !== -1;
                });

                return index !== -1;
            });

            return result.length === comp.length;
        } else if (typeof comp === 'string') {
            const index = comps.findIndex((val) => {
                return val.indexOf(comp) !== -1;
            });

            return index !== -1;
        }
    }

    /*
     * 获取组件属性
     * @param {array} comp 组件名
     * @param {array} comps 组件名称列表
     * @return {array} attrs 属性 
     */
    gasCompAttrs(comp, comps) {
        let attrs = null;

        const index = comps.findIndex((val) => {
            return val.indexOf(comp) !== -1;
        });

        if (index !== -1) {
            attrs = comps[index].split('@')[1];

            attrs = new Set(attrs.split('-'));
        }

        return attrs;
    }

    /*
     * 更新UI
     * @param {object} state 状态
     */
    updateUI(state) {
        this._ecs.ui.updateUI(state);
    }

    /*
     * 更新player状态
     * @param {object} entitys 实体集合
     */
    updatePlayerUI(entitys) {
        render.player(this._ecs, this, entitys);
    }
}
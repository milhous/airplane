// 公共
import * as common from '../common.game.js';
// 组件
import Components from '../components.game.js';

// 玩家移动
export default class PlayerMovementSystem extends ecs.System {
    static get name() {
        return 'PlayerMovementSystem';
    }

    constructor() {
        super();
    }

    onLoad() {
        // 边界检测
        this._ecs.workerManager.open('Math', 'boundaryDetection', (data) => {
            this.boundaryDetection(data);
        });

        // 缓动
        this._ecs.workerManager.open('Math', 'tween', (data) => {
            this.move(data);
        });
    }

    onUpdate(dt) {
        let data = null;

        if (this._ecs.input.has(this._ecs.input.keyCode.MOVE)) {
            data = this._ecs.input.get(this._ecs.input.keyCode.MOVE);
        }

        this.updateEntity(data);
    }

    /*
     * 更新
     * @param {object} data 数据
     */
    updateEntity(data) {
        const playerEntity = this._ecs.entityManager.find('Player', Components.BasicsProp, { 'name': 'EVANGELION' });

        if (!playerEntity) {
            return;
        }

        // 设置目标地点坐标
        if (data !== null && data.hasOwnProperty('x') && data.hasOwnProperty('y')) {
            const worldEntity = ecs.entityManager.first('World');
            const worldShape = worldEntity.getComp(Components.Shape);
            const playerShape = playerEntity.getComp(Components.Shape);

            const position = {
                x: data.x,
                y: data.y
            };
            const maxSize = {
                width: worldShape.width,
                height: worldShape.height
            };
            const originSize = { 
                width: playerShape.width,
                height: playerShape.height
            };

            this._ecs.workerManager.send('Math', {
                cmd: 'boundaryDetection',
                preload: {
                    position,
                    originSize,
                    maxSize
                }
            });
        }

        // 向目标地点缓动
        const playerTween = playerEntity.getComp(Components.Tween);

        if (playerTween.enabled) {
            const playerPosition = playerEntity.getComp(Components.Position);
            const start = {
                x: playerPosition.x,
                y: playerPosition.y
            };
            const end = {
                x: playerTween.x,
                y: playerTween.y
            };
            const speed = playerTween.speed;

            this._ecs.workerManager.send('Math', {
                cmd: 'tween',
                preload: {
                    start,
                    end,
                    speed
                }
            });
        }
    }

    /*
     * 边界检测
     * @param {object} data 数据
     */
    boundaryDetection({
        x,
        y
    }) {
        const playerEntity = this._ecs.entityManager.find('Player', Components.BasicsProp, { 'name': 'EVANGELION' });

        if (!playerEntity) {
            return;
        }

        playerEntity.setCompsState(Components.Tween, {
            enabled: true,
            x,
            y
        });
    }

    /*
     * 移动
     * @param {object} data 数据
     */
    move({
        x,
        y
    }) {
        const playerEntity = this._ecs.entityManager.find('Player', Components.BasicsProp, { 'name': 'EVANGELION' });

        if (!playerEntity) {
            return;
        }

        const playerPosition = playerEntity.getComp(Components.Position);
        const playerTween = playerEntity.getComp(Components.Tween);

        playerEntity.setCompsState(Components.Position, {
            x,
            y
        });

        if (playerPosition.x === playerTween.x && playerPosition.y === playerTween.y) {
            // 更新玩家缓动
            playerEntity.setCompsState(Components.Tween, {
                enabled: false
            });
        }
    }
}
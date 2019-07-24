import Components from '../components.game.js';

// 玩家移动
export default class PlayerMovementSystem extends ecs.System {
    static get name() {
        return 'PlayerMovementSystem';
    }

    constructor() {
        super();
    }

    onLoad() {}

    onUpdate(dt) {
        let data = null;

        if (this._ecs.input.has(this._ecs.input.keyCode.MOVE)) {
            data = this._ecs.input.get(this._ecs.input.keyCode.MOVE);
        }

        this.move(data);
    }

    /*
     * 移动
     * @param {object} data 数据
     */
    move(data) {
        const playerEntity = this._ecs.entityManager.find('Player', Components.PlayerProp, { 'name': 'Milhous' });

        if (!playerEntity) {
            return;
        }

        if (data !== null && data.hasOwnProperty('x') && data.hasOwnProperty('y')) {
            playerEntity.setCompsState(Components.Tween, {
                enabled: true,
                x: data.x,
                y: data.y
            });
        }

        const playerTween = playerEntity.getComp(Components.Tween);

        if (playerTween.enabled) {
            const playerPosition = playerEntity.getComp(Components.Position);

            const result = this.tween(playerPosition, playerTween);

            playerEntity.setCompsState(Components.Position, {
                x: result.x,
                y: result.y
            });

            if (playerPosition.x === playerTween.x && playerPosition.y === playerTween.y) {
                // 更新玩家缓动
                playerEntity.setCompsState(Components.Tween, {
                    enabled: false
                });
            }
        }
    }

    /*
     * 缓动（每帧移动一段距离）
     * @param {object} startPoint 起点
     * @param {object} endPoint 终点
     * @return {object} result 
     */
    tween(startPoint, endPoint) {
        const startX = startPoint.x;
        const startY = startPoint.y;
        const endX = endPoint.x;
        const endY = endPoint.y;

        let x = 0;
        let y = 0;

        // 缓动效果
        const offsetX = endX - startX > 0 ? 20 : -20;
        const offsetY = endY - startY > 0 ? 20 : -20;

        x += startX + offsetX;
        y += startY + offsetY;

        if ((offsetX > 0 && x > endX) || (offsetX < 0 && x < endX)) {
            x = endX;
        }

        if ((offsetY > 0 && y > endY) || (offsetY < 0 && y < endY)) {
            y = endY;
        }

        return {
            x,
            y
        }
    }
}
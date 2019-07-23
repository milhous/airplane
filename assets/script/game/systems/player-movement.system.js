import Components from '../components.game.js';

// 玩家移动
export default class PlayerMovementSystem extends ecs.System {
    static get name() {
        return 'PlayerMovementSystem';
    }

    constructor() {
        super();
    }

    onLoad() { }

    onUpdate(dt) {
        let data = null;

        if (this._ecs.input.has(this._ecs.input.keyCode.MOVE)) {
            data = this._ecs.input.get(this._ecs.input.keyCode.MOVE);
        }

        if (!!data) {
            console.log('PlayerMovementSystem',data);
        }
    }

    /*
     * 玩家移动
     * @param {object} data 数据
     */
    playerMove(data) {
        const playerEntity = this._ecs.entityManager.find('Player', Components.Owner, { 'id': data.id });
        const worldEntity = this._ecs.entityManager.first('World');

        if (!playerEntity || !worldEntity) {
            return;
        }
        const environment = worldEntity.getComp(Components.Environment);
        const playerPosition = playerEntity.getComp(Components.Position);
        const playerOwner = playerEntity.getComp(Components.Owner);

        // 更新玩家变换
        playerEntity.setCompsState(Components.Transform, {
            angle: data.angle,
            direction: data.direction
        });

        // 更新玩家位置 & 缓动
        let tween = null;
        let isFall = 0;

        if (data.moved === -1 || data.x === -1 || data.y === -1) {
            // 玩家掉落死亡
            tween = {
                x: playerPosition.x,
                y: environment.mapHeight - 1,
                enabled: true
            };

            isFall = 1;

            // 处于死亡状态掉落时，隐藏技能面板，touchscope,controller
            worldEntity.setCompsState(Components.Environment, {
                actId: ''
            }, false);
        } else if (Math.abs(data.y - playerPosition.y) > 20) {
            // 玩家正常掉落
            tween = {
                x: data.x,
                y: data.y,
                enabled: true
            };

            isFall = 1;
        } else {
            playerEntity.setCompsState(Components.Position, {
                x: data.x,
                y: data.y
            });

            // 更新摄像机数据，解决试炼模式相机来回晃的问题
            if(environment.gameMode == 'courage') {
                if(playerOwner.enabled && playerOwner.id === environment.myRoleId && playerOwner.id === environment.actId) {
                    common.moveCamera(this._ecs, {
                        x: playerPosition.x,
                        y: playerPosition.y
                    });
                }
            } else {
                common.moveCamera(this._ecs, {
                    x: playerPosition.x,
                    y: playerPosition.y
                });
            }
        }

        // 更新玩家属性
        playerEntity.setCompsState(Components.PlayerProp, {
            actionPoint: data.actionPoint,
            isFall
        });

        if (!!tween) {
            playerEntity.setCompsState(Components.Tween, tween);
        }

        utils.audio.playSound('move');
    }

    playerFall() {
        // 更新玩家掉落和死亡状态
        const playerMap = this._ecs.entityManager.getMap('Player');

        if (!playerMap) {
            return;
        }

        for (let playerEntity of playerMap.values()) {
            // 世界实体
            const worldEntity = this._ecs.entityManager.first('World');
            const environment = worldEntity.getComp(Components.Environment);

            const playerOwner = playerEntity.getComp(Components.Owner);
            const playerPosition = playerEntity.getComp(Components.Position);
            const playerTransform = playerEntity.getComp(Components.Transform);
            const playerProp = playerEntity.getComp(Components.PlayerProp);
            const playerTween = playerEntity.getComp(Components.Tween);

            if (playerTween.enabled) {
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
                    // isFall为2，则掉落后切回合
                    if (playerProp.isFall === 2) {
                        // 更新世界状态
                        worldEntity.setCompsState(Components.Environment, {
                            roundState: 2
                        });
                    }
                }

                // 更新摄像机数据
                if (playerOwner.id === environment.actId) {
                    common.moveCamera(this._ecs, {
                        x: playerPosition.x,
                        y: playerPosition.y
                    });
                }

                // 如果玩家y坐标大于地图高度，说明掉下去了，消失，此时是怪物,不播放死亡动画(因为播放死亡动画后会销毁实体，无法再下落)
                if (playerTween.y !== 1800) {
                    // 如果人物位置等于地图位置，则人物死亡
                    if (playerPosition.y >= environment.mapHeight - 1) {
                        // 更新玩家状态
                        playerEntity.setCompsState(Components.Owner, {
                            enabled: false
                        });

                        // 生命值变为0
                        playerEntity.setCompsState(Components.PlayerProp, {
                            healthPoint: 0
                        });
                    }
                }
            }

        }
    }

    /*
     * 缓动（每帧移动一段距离）
     * @param {object} startPoint 起点
     * @param {object} endPoint 终点
     * @return {object} point 坐标点
     */
    tween(startPoint, endPoint) {
        const startX = startPoint.x;
        const startY = startPoint.y;
        const endX = endPoint.x;
        const endY = endPoint.y;

        let x = 0;
        let y = 0;

        // 缓动效果
        const offsetX = endX - startX > 0 ? 15 : -15;
        const offsetY = endY - startY > 0 ? 15 : -15;

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
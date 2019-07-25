// System
import Systems from '../game/systems.game.js';

// 对象池管理器
const PoolManager = require('Pool.manager');

cc.Class({
    extends: cc.Component,

    properties: {
        keyCode: {
            default: null,
            type: cc.JsonAsset,
        },
        // 面板
        panel: {
            default: null,
            type: cc.Node
        },
        // 飞机
        airplane: {
            default: null,
            type: cc.Node
        },
        bulletPool: {
            default: null,
            type: PoolManager
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.init();

        this.initEvent();
    },

    start() {
        ecs.send(Systems.BattleStartSystem, {
            player: {
                id: '20190724',
                name: 'Milhous',
                level: 1,
                healthPoint: 100,
                maxHealthPoint: 100,
                model: 1,
                position: {
                    x: this.node.width / 2,
                    y: 100
                }
            }
        });
    },

    update(dt) {
        ecs.update(dt);
    },

    // 初始化
    init() {
        // 初始化ecs
        ecs.init({
            ui: this,
            keyCode: this.keyCode.json,
            Systems
        });

        // 初始化子弹对象池
        this.bulletPool.init();
    },

    // 初始化事件
    initEvent() {
        this.panel.on(cc.Node.EventType.TOUCH_MOVE, (evt) => {
            const vec = evt.getLocation();

            ecs.input.set(ecs.input.keyCode.MOVE, {
                x: vec.x,
                y: vec.y
            });
        }, this);

        this.panel.on(cc.Node.EventType.TOUCH_END, (evt) => {
            const vec = evt.getLocation();

            ecs.input.set(ecs.input.keyCode.MOVE, {
                x: vec.x,
                y: vec.y
            });
        }, this);
    },

    // 更新UI
    updateUI(state = {}) {
        for (const name in state) {
            if (typeof this[name] === 'function') {
                const data = state[name];

                this[name](data);
            }
        }
    },

    // 创建玩家
    createPlayer(data) {
        const vec = cc.v2(data.x, data.y);
        const position = this.node.convertToNodeSpaceAR(vec);

        this.airplane.setPosition(position);

        cc.log('createPlayer', data);
    },

    // 更新玩家
    updatePlayer(data) {
        const vec = cc.v2(data.x, data.y);
        const position = this.node.convertToNodeSpaceAR(vec);

        this.airplane.setPosition(position);

        cc.log('updatePlayer', data, position);
    },

    // 创建子弹
    createBullet(data) {
        const node = cc.instantiate(this.target);

        node.parent = scene;
        node.setPosition(0, 0);
    }
});
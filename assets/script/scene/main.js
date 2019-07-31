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
        player: {
            default: null,
            type: cc.Node
        },
        // 敌人对象池
        enemyPool: {
            default: [],
            type: [PoolManager]
        },
        // 弹药对象池
        bulletPool: {
            default: null,
            type: PoolManager
        }
    },

    ctor() {
        // 玩家组件
        this._playerComp = null;
        // 弹药
        this._ammoMap = new Map();
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.init();

        this.initComponent();

        this.initEvent();
    },

    start() {
        this.gameStart();
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

    // 初始化组件
    initComponent() {
        // 玩家
        this._playerComp = this.player.getComponent('Player');
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

    // 开始游戏
    gameStart() {
        const screenSize = cc.winSize;
        const playerSize = this.player.getContentSize();

        ecs.send(Systems.BattleStartSystem, {
            world: {
                width: screenSize.width,
                height: screenSize.height
            },
            player: {
                id: '9527',
                name: 'Milhous',
                level: 1,
                healthPoint: 100,
                maxHealthPoint: 100,
                model: 1,
                width: playerSize.width,
                height: playerSize.height,
                x: screenSize.width / 2,
                y: 100,
                speed: 10
            }
        });
    },

    // 开火
    openFire() {
        const firepowers = this._playerComp.getFirepowerInfo(1);

        ecs.send(Systems.OpenFireSystem, {
            firepowers
        });
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
        const { id, name, x, y } = data;
        const vec = cc.v2(x, y);
        const position = this.node.convertToNodeSpaceAR(vec);

        this._playerComp.setBasicInfo({
            id,
            name
        });

        this.player.setPosition(position);

        this.schedule(() => {
            this.openFire();
        }, .2);
    },

    // 更新玩家
    updatePlayer(data) {
        const vec = cc.v2(data.x, data.y);
        const position = this.node.convertToNodeSpaceAR(vec);

        this.player.setPosition(position);
    },

    // 创建弹药
    createAmmo(data) {
        const vec = cc.v2(data.x, data.y);
        const position = this.node.convertToNodeSpaceAR(vec);

        const ammo = this.bulletPool.request();
        ammo.setPosition(position);
        ammo.parent = this.node;

        this._ammoMap.set(data.eid, ammo);
    },


    // 更新弹药
    updateAmmo(data) {
        if (!this._ammoMap.has(data.eid)) {
            return;
        }

        const vec = cc.v2(data.x, data.y);
        const position = this.node.convertToNodeSpaceAR(vec);

        const ammo = this._ammoMap.get(data.eid);
        ammo.setPosition(position);
    },

    // 销毁弹药
    destroyAmmo(data) {
        if (!this._ammoMap.has(data.eid)) {
            return;
        }

        const ammo = this._ammoMap.get(data.eid);

        this.bulletPool.recover(ammo);
    },
});
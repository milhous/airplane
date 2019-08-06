// System
import Systems from '../game/systems.game.js';
// Worker
import Workers from '../game/workers.game.js';

// 对象池管理器
const PoolManager = require('Pool.manager');

cc.Class({
    extends: cc.Component,

    properties: {
        // 基础配置
        basicConfig: {
            default: null,
            type: cc.JsonAsset,
        },
        // 输入码
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
        enemyPools: {
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
        // 基础配置
        this._basic = null;
        // 玩家组件
        this._playerComp = null;
        // 弹药
        this._ammoMap = new Map();
        // 敌方
        this._enemyMap = new Map();
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
        this._basic = this.basicConfig.json;

        // 初始化ecs
        ecs.init({
            ui: this,
            keyCode: this.keyCode.json,
            Systems,
            Workers
        });

        // 初始化子弹对象池
        this.bulletPool.init();

        // 初始化敌方对象池
        for (const enemyPool of this.enemyPools) {
            enemyPool.init();
        }
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
                id: '0',
                name: 'EVANGELION',
                level: 1,
                healthPoint: 100,
                maxHealthPoint: 100,
                model: 1,
                width: playerSize.width,
                height: playerSize.height,
                x: screenSize.width / 2,
                y: 100,
                speed: this._basic.PLAYER_SPEED
            }
        });
    },

    // 开火
    openFire() {
        const firepowers = this._playerComp.getFirepowerInfo(1);
        const ammoSize = this.bulletPool.getSize();

        for (const item of firepowers) {
            item.speed = this._basic.AMMO_SPEED;
            item.width = ammoSize.width;
            item.height = ammoSize.height;
        }

        ecs.send(Systems.OpenFireSystem, {
            firepowers
        });
    },

    // 敌军
    enemyFactory() {
        const screenSize = cc.winSize;
        const enemySize = this.enemyPools[0].getSize();

        ecs.send(Systems.EnemySpawnSystem, {
            id: '0',
            name: 'ANGEL',
            level: 1,
            healthPoint: 100,
            maxHealthPoint: 100,
            model: 1,
            width: enemySize.width,
            height: enemySize.height,
            minSpeed: this._basic.ENEMY_MIN_SPEED,
            maxSpeed: this._basic.ENEMY_MAX_SPEED
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
        const vec = this.convertCoordinate(data.x, data.y);

        this._playerComp.setBasicInfo({
            id,
            name
        });

        this.player.setPosition(vec);

        this.schedule(() => {
            this.openFire();
        }, this._basic.SHOOT_SPEED);

        this.schedule(() => {
            this.enemyFactory();
        }, .6);
    },

    // 更新玩家
    updatePlayer(data) {
        const vec = this.convertCoordinate(data.x, data.y);

        this.player.setPosition(vec);
    },

    // 创建敌方
    createEnemy(data) {
        const vec = this.convertCoordinate(data.x, data.y);
        const enemy = this.enemyPools[0].request();
        enemy.setPosition(vec);
        enemy.parent = this.node;

        this._enemyMap.set(data.eid, enemy);
    },

    // 更新敌方
    updateEnemy(data) {
        if (!this._enemyMap.has(data.eid)) {
            return;
        }

        const vec = this.convertCoordinate(data.x, data.y);
        const enemy = this._enemyMap.get(data.eid);
        enemy.setPosition(vec);
    },

    // 销毁敌方
    destroyEnemy(data) {
        if (!this._enemyMap.has(data.eid)) {
            return;
        }

        const enemy = this._enemyMap.get(data.eid);

        this.enemyPools[0].recover(enemy);
    },

    // 创建弹药
    createAmmo(data) {
        const vec = this.convertCoordinate(data.x, data.y);
        const ammo = this.bulletPool.request();
        ammo.setPosition(vec);
        ammo.parent = this.node;

        this._ammoMap.set(data.eid, ammo);
    },

    // 更新弹药
    updateAmmo(data) {
        if (!this._ammoMap.has(data.eid)) {
            return;
        }

        const vec = this.convertCoordinate(data.x, data.y);
        const ammo = this._ammoMap.get(data.eid);
        ammo.setPosition(vec);
    },

    // 销毁弹药
    destroyAmmo(data) {
        if (!this._ammoMap.has(data.eid)) {
            return;
        }

        const ammo = this._ammoMap.get(data.eid);

        this.bulletPool.recover(ammo);
    },

    /*
     * 转换坐标
     * @param {number} x x轴坐标
     * @param {number} y y轴坐标
     * @return {object} result
     */ 
    convertCoordinate(x, y) {
        const vec = cc.v2(x, y);
        const position = this.node.convertToNodeSpaceAR(vec);

        return position;
    }
});
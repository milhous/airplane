// System
import Systems from '../game/systems.game.js';

cc.Class({
    extends: cc.Component,

    properties: {
        keyCode: {
            default: null,
            type: cc.JsonAsset,
        },
        panel: {
            default: null,
            type: cc.Node
        },
        airplane: {
            default: null,
            type: cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.init();

        this.initEvent();
    },

    start () {
        console.log(this.keyCode.json);
    },

    update (dt) {
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
    }
});

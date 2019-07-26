cc.Class({
    extends: cc.Component,

    properties: {
        // 枪
        gun: {
            default: null,
            type: cc.Node
        },
        // 导弹
        missile: {
            default: [],
            type: [cc.Node]
        }
    },

    onLoad () {},

    start () {},

    // 更新位置

    // update (dt) {},
});

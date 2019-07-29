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

    ctor() {
        this._uid = null;
        this._uname = null;
    },

    onLoad() {},

    start() {},

    /*
     * 获取基础信息
     * @param {object} result
     */
    getBasicInfo() {
        return {
            uid: this._uid,
            uname: this._uname
        };
    },

    /*
     * 设置基础信息
     * @param {number} id ID
     * @param {string} name 名称 
     */
    setBasicInfo({
        id,
        name
    }) {
        this._uid = id;
        this._uname = name;
    },

    /*
     * 获取火力信息
     * @param {number} type 类型 0: 机枪, 1: 机枪&导弹
     */
    getFirepowerInfo(type = 0) {
        const arr = [];
        let pos = this.node.convertToWorldSpaceAR(this.gun.getPosition());

        arr.push({
            model: 0,
            x: pos.x,
            y: pos.y,
            id: this._uid
        });

        if (type > 0) {
            for (const node of this.missile) {
                pos = this.node.convertToWorldSpaceAR(node.getPosition());

                arr.push({
                    model: 1,
                    x: pos.x,
                    y: pos.y,
                    id: this._uid
                });
            }
        }

        return arr;
    }

    // update (dt) {},
});
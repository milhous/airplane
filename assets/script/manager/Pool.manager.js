// 对象池管理器
const PoolManager = cc.Class({
    name: 'PoolManager',

    properties: {
        prefab: cc.Prefab,
        size: 0
    },

    ctor() {
        // 对象池
        this._pool = new cc.NodePool();
        // 节点列表
        this._list = new Map();
    },

    // 初始化
    init() {
        for (let i = 0; i < this.size; i++) {
            // 创建节点
            const node = cc.instantiate(this.prefab);
            // 通过 put 接口放入对象池
            this._pool.put(node);
        }
    },

    /*
     * 获取
     * @return {object} result
     */ 
    request() {
        if (this._pool.size() < 1) {
            cc.log("Error: the pool do not have enough free item.");

            return null;
        }

        const node = this._pool.get();

        if (node) {
            node.active = true;
        }

        this._list.set(node.uuid, node);

        return node;
    },

    /*
     * 回收
     * @param {object} node 节点
     * @param {boolean} isDelete  是否删除
     */
    recover(node, isDelete = true) {
        if (node.active) {
            node.active = false;
        }

        if (node.parent) {
            node.removeFromParent();
        }

        if (isDelete) {
            this._list.delete(node.uuid);
        }

        this._pool.put(node);
    },

    // 重置
    reset() {
        for (let node of this._list.values()) {
            this.recover(node, false);
        }

        this._list.clear();
    }
});

module.exports = PoolManager;
// 弹药属性
export default class AmmoProp extends ecs.Component {
    static get name() {
        return 'AmmoProp';
    }

    /*
     * @param {number} damage 伤害
     * @param {number} model 型号
	 */
    constructor({
        damage = 0,
        model = 1
    } = {}) {
        super();

        this.damage = damage;
        this.model = model;
    }
}
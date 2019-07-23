// Systems
import Systems from '../game/systems.game.js';
// Components
import Components from './components.game.js';

/*
 * 组装武器实体
 * @param (string) playerId 玩家ID
 * @param (object) weapon 武器数据
 */
export function spawnWeaponEntity(playerId, weapon) {

    var arr = Object.keys(weapon);
    if (arr.length == 0) {
        return;
    }
    
    const weaponOwner = new Components.Owner(playerId, true);
    const weaponProp = new Components.WeaponProp({
        id: weapon.itemId,
        itemId: weapon.itemId,
        launchAngle: weapon.angle.split('-')
    });

    const weaponEntity = new ecs.Entity('Weapon')
        .addComp(weaponProp)
        .addComp(weaponOwner);
}

/*
 * 组装缓存实体
 * @param {string | number} tag 标识
 * @param {array | object} data 数据
 */
export function spawnCacheEntity(tag, data) {
    const cacheOwner = new Components.Owner(tag, true);
    const cacheProp = new Components.CacheProp(data);

    const cacheEntity = new ecs.Entity('Cache')
        .addComp(cacheOwner)
        .addComp(cacheProp);
}

/*
 * 组装轨迹实体
 * @param (object) ecs ecs框架
 * @param {string} battleId 对战ID
 */
export function spawnTracks(ecs, battleId) {
    const nums = 15;
    const points = [];

    for (let i = 0; i < nums; i++) {
        points.push({
            x: 200,
            y: 600
        });
    }

    // 世界实体
    const trackOwner = new Components.Owner(battleId, true);
    const trackProp = new Components.TrackProp({
        points,
        nums
    });
    const trackTransform = new Components.Transform();
    const trackSkin = new Components.Skin('icon-trace.png');

    const trackEntity = new ecs.Entity('Track')
        .addComp(trackOwner)
        .addComp(trackProp)
        .addComp(trackTransform)
        .addComp(trackSkin);
}

/*
 * 组装摄像机实体
 * @param (object) ecs ecs框架
 * @param (number) width 镜头宽
 * @param (number) height 镜头高
 */
export function spawnCamera(ecs, width, height) {
    const cameraOwner = new Components.Owner(null, true);
    const cameraShape = new Components.Shape({ width, height });
    const cameraPosition = new Components.Position();
    const cameraTransform = new Components.Transform();
    const cameraTween = new Components.Tween({ x: 0, y: 0 });

    const cameraEntity = new ecs.Entity('Camera')
        .addComp(cameraOwner)
        .addComp(cameraShape)
        .addComp(cameraPosition)
        .addComp(cameraTransform)
        .addComp(cameraTween);
}

/*
 * 摄像机移动
 * @param (object) ecs ecs框架
 * @param (object) poinit 坐标
 * @param (boolean) enabled 是否开启缓动
 */
export function moveCamera(ecs, point, enabled = false) {
    if (!point || !ecs) {
        return;
    }

    const cameraEntity = ecs.entityManager.first('Camera');
    const cameraShape = cameraEntity.getComp(Components.Shape);

    const x = point.x - cameraShape.width / 2;
    const y = point.y - cameraShape.height / 2;

    cameraEntity.setCompsState(Components.Tween, {
        enabled,
        x,
        y
    });
}

/*
 * 摄像机缩放
 * @param (object) ecs ecs框架
 */
export function cameraScale(ecs) {
    if (_ui._scaleNode.scaleX === 1) {
        return;
    }

    ecs.input.set(ecs.input.keyCode.SCALE_CAMERA, {
        distance: -3
    });

    if (_ui._scaleNode.scaleX <= 0.6 || _ui._scaleNode.scaleX >= 0.9) {
        _ui.isInitCamera = false;

        const worldEntity = ecs.entityManager.first('World');
        const environment = worldEntity.getComp(Components.Environment);
        const playerEntity = ecs.entityManager.find('Player', Components.Owner, { 'id': environment.actId });

        if (!playerEntity) {
            return;
        }
        const playerPosition = playerEntity.getComp(Components.Position);
        moveCamera(ecs, playerPosition, true);
    }
}

/*
 * 玩家掉落
 * @param (playerEntity) 玩家实体
 * @param playerY 玩家Y坐标
 */
export function playerDrop(playerEntity, playerY) {
    const playerPosition = playerEntity.getComp(Components.Position);
    // 更新玩家属性(死亡 & 掉落)
    playerEntity.setCompsState(Components.PlayerProp, {
        isFall: 1
    });

    // 如果飞出屏幕外代表player死亡，此时，playerY赋值为地图高度
    // let playerY = environment.mapHeight - 1;

    // 更新玩家缓动
    playerEntity.setCompsState(Components.Tween, {
        enabled: true,
        x: playerPosition.x,
        y: playerY
    });
}
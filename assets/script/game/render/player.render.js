// 组件
import Components from '../components.game.js';

/*
 * 玩家渲染
 * @param {object} ecs ecs框架
 * @param {object} render 渲染系统
 * @param {object} entitys 实体集合
 */
export default function renderPlayer(ecs, render, entitys) {
    for (const [entity, comps] of entitys) {
        if (!(!!ecs && !!render && !!entity && Array.isArray(comps) && comps.length)) {
            return;
        }

        const worldEntity = ecs.entityManager.first('World');
        const environment = worldEntity.getComp(Components.Environment);
        const skillEntityMap = ecs.entityManager.getMap('Skill');

        const playerOwner = entity.getComp(Components.Owner);
        const playerProp = entity.getComp(Components.PlayerProp);
        const playerPosition = entity.getComp(Components.Position);
        const playerTransform = entity.getComp(Components.Transform);
        const playerTween = entity.getComp(Components.Tween);
        const playerDamage = entity.getComp(Components.Damage);

        const state = {};

        // battleStartSystem,recoverySystem
        if (render.hasComps(['Owner', 'PlayerProp', 'Position', 'Transform', 'Tween', 'Damage'], comps)) {
            if(playerOwner.enabled) {
                Object.assign(state, {
                    addPlayer: {
                        id: playerOwner.id,
                        x: playerPosition.x,
                        y: playerPosition.y,
                        fashion: playerProp.fashion,
                        weapon: playerProp.weapon,
                        sex: playerProp.sex,
                        name: playerProp.name,
                        level: playerProp.level,
                        healthPoint: playerProp.imageResources === '12511' ? 0 : playerProp.healthPoint,
                        maxHealthPoint: playerProp.imageResources === '12511' ? 0 : playerProp.maxHealthPoint,
                        camp: playerProp.camp,
                        roleType: playerProp.roleType,
                        angle: playerTransform.angle,
                        direction: playerTransform.direction,
                        imageResources: playerProp.imageResources,
                        isUseSkill: playerProp.isUseSkill
                    }
                });

                if(!(environment.gameMode === 'courage' && playerProp.roleType == 4)) {
                    Object.assign(state, {
                        addPlayerDetail: {
                            id: playerOwner.id,
                            hp: playerProp.imageResources === '12511' ? 0 : playerProp.healthPoint,
                            maxHp: playerProp.imageResources === '12511' ? 0 : playerProp.maxHealthPoint,
                            camp: playerProp.camp,
                            imageResources: playerProp.imageResources,
                            fashion: playerProp.fashion,
                            sex: playerProp.sex
                        }
                    })
                }
            }
        }

        // player 属性更改
        if (render.hasComps(['PlayerProp'], comps)) {

            const playerPropAttrs = render.gasCompAttrs('PlayerProp', comps);

            // 技能效果
            if (playerProp.skillNo && playerPropAttrs.has('skillNo')) {
                if(playerProp.skillNo != 1213 || playerProp.skillNo != 1201) {
                    Object.assign(state, {
                        addSkillWord: {
                            id: playerOwner.id,
                            skillNo: playerProp.skillNo
                        }
                    });
                }

                if (playerProp.skillNo != 1213 && playerProp.skillNo != 1201 && !(playerProp.skillNo >= 1010 && playerProp.skillNo <= 1013)) {
                    Object.assign(state, {
                        addSkillImage: {
                            id: playerOwner.id,
                            skillNo: playerProp.skillNo
                        }
                    });
                }

                // 影响个人技能骨骼
                switch (playerProp.skillNo) {
                    case "1010":
                    case "1011":
                    case "1012":
                    case "1013":
                    case "1015":
                    case "1016":
                    case "1017":
                    case "1019":
                    case "1021":
                    case "1201":
                    case "1213":
                        Object.assign(state, {
                            playSkillDrgon: {
                                id: playerOwner.id,
                                skillNo: playerProp.skillNo
                            }
                        });
                        break;
                }
            }

            if (playerProp.buffNo && playerPropAttrs.has('buffNo')) {
                if (playerProp.buffNo != '1003') {
                    // 显示技能文字
                    switch (playerProp.buffNo) {
                        case '100':
                        case '101':
                        case '1500':
                        case '1501':
                        case '1502':
                        case '1503':
                        case '1504':
                        case '1505':
                        case '1506':
                        case '1508':
                        case '1509':
                        case '1510':
                        case '1511':
                        case '1512':
                        case '1513':
                        case '1515':
                        case '1516':
                        case '1523':
                        case '1524':
                        case '1525':
                        case '1526':
                        case '1527':
                        case '1528':
                            Object.assign(state, {
                                addSkillWord: {
                                    id: playerOwner.id,
                                    skillNo: playerProp.buffNo,
                                    isCrit: playerDamage.isCrit
                                }
                            });
                            break;
                    }
                }

                switch (playerProp.buffNo) {
                    case '1003':
                    case '1507':
                    case '1500':
                    case '1501':
                        // 影响个人技能骨骼
                        Object.assign(state, {
                            playSkillDrgon: {
                                id: playerOwner.id,
                                skillNo: playerProp.buffNo
                            }
                        });
                        break;
                }
            }

            // 大招怒气动画 
            if (playerPropAttrs.has('angerDragon')) {
                Object.assign(state, {
                    addAngerPlayerDrgon: playerProp.angerDragon
                });
            }

            // 切回合时进行相应更新
            if (playerPropAttrs.has('actId')) {
                // 阵营
                const type = environment.myCamp == playerProp.camp ? 1 : 2;
                if (playerOwner.id === environment.actId) {
                    // 更新UI
                    Object.assign(state, {
                        showMark: {
                            id: playerOwner.id,
                            type: type,
                            enabled: true
                        },
                        updateTurnStatus: {
                            id: playerOwner.id,
                            enabled: true
                        },
                        changePlayerOrder: {
                            id: playerOwner.id,
                            order: 3
                        },
                    });
                } else {
                    const _order = playerProp.roleType >= 3 ? 1 : 2;
                    // 更新UI
                    Object.assign(state, {
                        showMark: {
                            id: playerOwner.id,
                            type: type,
                            enabled: false
                        },
                        updateTurnStatus: {
                            id: playerOwner.id,
                            enabled: false
                        },
                        changePlayerOrder: {
                            id: playerOwner.id,
                            order: _order
                        }
                    });
                }

                // 如果体力为0，清除controller定时器
                if (playerProp.actionPoint === 0) {
                    Object.assign(state, {
                        clearTimer: true,
                    });
                }

                Object.assign(state, {
                    destroySkill: playerOwner.id,
                    playPlayerDrgon: {
                        id: playerOwner.id,
                        type: '1',
                        isLoop: true
                    }
                });
            }

            // 更新玩家生命值、buff
            const buff = [];

            playerProp.buff.map(obj => {
                buff.push(obj.buff_no);
            });

            if (buff.indexOf('1521') !== -1 || buff.indexOf('1522') !== -1) { // 更新隐身透明度效果
                let alpha = playerProp.camp === environment.myCamp ? 0.5 : 0;

                if (playerProp.healthPoint != 0) {
                    Object.assign(state, {
                        updatePlayerAlpha: {
                            id: playerOwner.id,
                            alpha: alpha,
                            isAni: false
                        }
                    });
                }
            }

            // 禁锢置灰左右移动面板
            if(buff.indexOf('1527') >= 0) {
                Object.assign(state, {
                    displayController: true
                });
            }

            // 回合判断是否存在隐身buff，没有则恢复
            if (buff.indexOf('1521') == -1 && buff.indexOf('1522') == -1) {
                Object.assign(state, {
                    updatePlayerAlpha: {
                        id: playerOwner.id,
                        alpha: 1,
                        isAni: true
                    }
                });
            }

            if (buff.indexOf('1507') == -1) {
                Object.assign(state, {
                    hideFrozenDrgon: playerOwner.id
                });
            } else {
                Object.assign(state, {
                    playSkillDrgon: {
                        id: playerOwner.id,
                        skillNo: '1507'
                    }
                });
            }

            Object.assign(state, {
                updatePlayer: {
                    id: playerOwner.id,
                    healthPoint: playerProp.imageResources === '12511' ? 0 : playerProp.healthPoint,
                    maxHealthPoint: playerProp.imageResources === '12511' ? 0 : playerProp.maxHealthPoint,
                    sex: playerProp.sex,
                },
                updatePlayerDetail: {
                    id: playerOwner.id,
                    healthPoint: playerProp.healthPoint,
                    maxHealthPoint: playerProp.maxHealthPoint
                },
                addBuff: {
                    id: playerOwner.id,
                    buff: playerProp.buff
                }
            });

            if (playerOwner.id === environment.myRoleId) {
                // 当player是自己，更新barPanel等UI
                Object.assign(state, {
                    barPanel: {
                        healthPoint: playerProp.healthPoint,
                        maxHealthPoint: playerProp.maxHealthPoint,
                        actionPoint: playerProp.actionPoint,
                        maxActionPoint: playerProp.maxActionPoint
                    }
                });

                // 行动力不足导致移动技能面板添加遮罩
                if(playerPropAttrs.has('actionPoint')) {
                    for(let skillEntity of skillEntityMap.values()) {
                        const skillOwner = skillEntity.getComp(Components.Owner);
                        const SkillProp = skillEntity.getComp(Components.SkillProp);
                        if(skillOwner) {
                            if(SkillProp.cd == 0 && SkillProp.actionPoint > playerProp.actionPoint) {
                                skillEntity.setCompsState(Components.SkillProp, {
                                    cd: 1
                                });
                            }
                        }
                    }

                    if(environment.moveVit > playerProp.actionPoint) {
                        Object.assign(state, {
                            displayController: true
                        });
                    }
                }
            }
        }

        // player 伤害属性更改
        if (render.hasComps(['Damage'], comps)) {
            if (playerDamage.value && playerDamage.value.length) {
                Object.assign(state, {
                    updateBloodAni: {
                        id: playerOwner.id,
                        changeHp: playerDamage.value,
                        isCrit: playerDamage.isCrit
                    }
                });

                if (playerDamage.value[0] > 0) {
                    Object.assign(state, {
                        playPlayerDrgon: {
                            id: playerOwner.id,
                            type: '0',
                            isLoop: false
                        }
                    });
                }
            }
        }

        // player 位置，角度，方向更改
        if (render.hasComps(['Position'], comps)) {
            Object.assign(state, {
                updatePlayer: {
                    id: playerOwner.id,
                    x: playerPosition.x,
                    y: playerPosition.y,
                    direction: playerTransform.direction,
                    angle: playerTransform.angle,
                    healthPoint: playerProp.imageResources === '12511' ? 0 : playerProp.healthPoint,
                    maxHealthPoint: playerProp.imageResources === '12511' ? 0 : playerProp.maxHealthPoint,
                    sex: playerProp.sex,
                },
                updateTouchScope: {
                    myRoleId: environment.myRoleId
                }
            });
            
            if (environment.actId === playerOwner.id) {
                // 如果在掉落过程中，移动和技能面板置灰
                const playerTweenAttrs = render.gasCompAttrs('Tween', comps);

                if(playerTweenAttrs && playerTweenAttrs.has('enabled')) {
                    if(playerTween.enabled){
                        Object.assign(state, {
                            displayController: true,
                            displayAnger: true,
                            updateCD: 1
                        });
                    } else{
                        const superEntity = ecs.entityManager.find('Super', Components.Owner, { id: environment.myRoleId });
                        const superOwner = superEntity.getComp(Components.Owner);
                        Object.assign(state, {
                            displayController: environment.moveVit > playerProp.actionPoint,
                            displayAnger: !superOwner.enabled
                        });
    
                        for(let skillEntity of skillEntityMap.values()) {
                            const skillOwner = skillEntity.getComp(Components.Owner);
                            const skillProp = skillEntity.getComp(Components.SkillProp);
                            skillEntity.setCompsState(Components.SkillProp, {
                                cd: skillProp.cd
                            }, false);
                        }
                    }
                }
            }
        }

        // player 角度，方向更改
        if (render.hasComps(['Transform'], comps)) {
            Object.assign(state, {
                updatePlayer: {
                    id: playerOwner.id,
                    x: playerPosition.x,
                    y: playerPosition.y,
                    direction: playerTransform.direction,
                    angle: playerTransform.angle,
                    healthPoint: playerProp.imageResources === '12511' ? 0 : playerProp.healthPoint,
                    maxHealthPoint: playerProp.imageResources === '12511' ? 0 : playerProp.maxHealthPoint,
                    sex: playerProp.sex,
                },
                updateTouchScope: {
                    myRoleId: environment.myRoleId
                }
            });
        }

        // 更新怪物死亡状态
        if (render.hasComps(['Owner'], comps)) {
            if (!playerOwner.enabled) {
                // 播放死亡特效
                if (playerProp.imageResources) {
                    if(environment.gameMode === 'courage' && playerProp.roleType === 4) {
                        if(playerProp.imageResources == 12501) {
                            if(!playerOwner.hasAni) {
                                Object.assign(state, {
                                    playPlayerDrgon: {
                                        id: playerOwner.id,
                                        type: '7',
                                        isLoop: false
                                    }
                                });
                            }
                            Object.assign(state, {
                                destroyMonster: {
                                    id: playerOwner.id,
                                    imageResources: playerProp.imageResources
                                }
                            });
                        } else {
                            Object.assign(state, {
                                destroyMonster: {
                                    id: playerOwner.id,
                                    imageResources: playerProp.imageResources,
                                    time: 0
                                }
                            });
                        }

                        ecs.entityManager.destroyEntity(entity);
                    } else {
                        if(environment.dieTextList && environment.dieTextList[playerOwner.id.split('-')[0]]) {
                            Object.assign(state, {
                                hasDealthChat: playerProp.buffNo == '1500' ? false : true,
                                addChat: {
                                    id: playerOwner.id,
                                    speak: environment.dieTextList[playerOwner.id.split('-')[0]],
                                    callback: ()=>{
                                        render.updateUI({
                                            playPlayerDrgon: {
                                                id: playerOwner.id,
                                                type: '7',
                                                isLoop: false
                                            },
                                            destroyMonster: {
                                                id: playerOwner.id,
                                                imageResources: playerProp.imageResources
                                            },
                                            destroyMonsterDetail: {
                                                id: playerOwner.id,
                                                camp: playerOwner.camp
                                            }
                                        });

                                        ecs.entityManager.destroyEntity(entity);
                                    }
                                }
                            });
                        } else {
                            Object.assign(state, {
                                playPlayerDrgon: {
                                    id: playerOwner.id,
                                    type: '7',
                                    isLoop: false
                                },
                                destroyMonster: {
                                    id: playerOwner.id,
                                    imageResources: playerProp.imageResources
                                },
                                destroyMonsterDetail: {
                                    id: playerOwner.id,
                                    camp: playerOwner.camp
                                },
                            });

                            ecs.entityManager.destroyEntity(entity);
                        }  
                    }
                }
            }
        }
        // 更新UI
        render.updateUI(state);
    }
}
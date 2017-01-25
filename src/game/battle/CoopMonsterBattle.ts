import PlayerCharacter from '../creature/player/PlayerCharacter';
import CreatureAIControlled from '../creature/CreatureAIControlled';
import WeaponAttack from '../item/weapon/WeaponAttack';
import WeaponAttackStep from '../item/weapon/WeaponAttackStep';
import IDamageSet from '../damage/IDamageSet';

const winston = require('winston');

const dummyAttack = new WeaponAttackStep(
    '{attacker} doesn\'t know what to do!',
    10000
);

interface PlayerDamaged{
    pc:PlayerCharacter,
    damages:IDamageSet,
    blocked:boolean,
}

export enum CoopMonsterBattleEvent{
    PlayerAttack,
    PlayerBlock,
    PlayersAttacked,
    BattleEnd,
    PlayerDeath
}

export interface PlayersAttackedEvent{
    players:Array<PlayerDamaged>;
    message:string;
}

export interface PlayerBlockedEvent{
    pc:PlayerCharacter;
}

export interface PlayerDeathEvent{
    pc:PlayerCharacter;
    lostXP:number;
    lostGold:number;
}

export interface BattleEndEvent{
    defeatedPCs: Array<PlayerCharacter>;
    survivingPCs: Array<PlayerCharacter>;
    victory: boolean;
}

export default class CoopMonsterBattle{
    id:number;
    pcs:Array<PlayerCharacter>;
    defeatedPCs:Array<PlayerCharacter>;
    opponent:CreatureAIControlled;
    _handlers:Array<Array<Function>>;
    _battleEnded:boolean;

    _currentAttack:WeaponAttack;
    _currentAttackStep:number;

    constructor(id:number,pcs:Array<PlayerCharacter>,opponent:CreatureAIControlled){
        this._battleEnded = false;

        this.id = id;
        this.pcs = pcs;
        this.defeatedPCs = [];

        this.pcs.forEach((pc)=>{
            pc.currentBattleData = {
                battle: this
            };
        });

        this.opponent = opponent;

        this._handlers = [];

        this._attackTick();
    }

    _attackTick(){   
        if(!this._currentAttack){
            this._currentAttack = this.opponent.getRandomAttack();
            this._currentAttackStep = 0;
        }

        let attackStep;

        if(this._currentAttack){    
            attackStep = this._currentAttack.steps[this._currentAttackStep++];
    
            if(this._currentAttack.steps.length >= this._currentAttackStep){
                this._currentAttack = null;
            }   
        }
        //Didn't find an elgible attack
        else{
            attackStep = dummyAttack;
        }

        this.attackPlayers(attackStep);

        if(!this._battleEnded){
            setTimeout(this._attackTick.bind(this),attackStep.cooldown);
        }        
    }

    attackPlayers(attackStep:WeaponAttackStep){
        const eventData:PlayersAttackedEvent = {
            players: [],
            message:attackStep.attackMessage
                .replace('{attacker}',this.opponent.title)
                .replace('{defender}',this.pcs.length==1?this.pcs[0].title:'the group')
        };

        this.pcs.forEach((pc:PlayerCharacter)=>{
            const pcDamages:IDamageSet = attackStep.getDamages(this.opponent,pc);

            let pcDamagesTotal = 0;

            //Reduce damage by player's resistance to it
            Object.keys(pcDamages).forEach(function(damageType){
                //Resistance = 0.0 (0%) to 0.9 (90%) damage reduction 
                pcDamages[damageType] = Math.round( pcDamages[damageType] * (1-pc.stats.Resistances[damageType]) );
                
                pcDamagesTotal += pcDamages[damageType];
            });

            pc.HPCurrent -= pcDamagesTotal;

            eventData.players.push({
                pc:pc,
                damages:pcDamages,
                blocked:false,
            });
        });

        this.dispatch(CoopMonsterBattleEvent.PlayersAttacked,eventData);

        //check if anybody died
        this.pcs.forEach((pc:PlayerCharacter)=>{
            if(pc.HPCurrent < 1){
                const eventData:PlayerDeathEvent = {
                    pc: pc,
                    lostXP: 0-pc.experience * 0.1,//TODO: implement actual xp lost
                    lostGold: 0-pc.gold / 2,//TODO: implement actual gold lost
                };

                this.pcs.splice(this.pcs.indexOf(pc),1);

                this.defeatedPCs.push(pc);
                
                this.dispatch(CoopMonsterBattleEvent.PlayerDeath,eventData);
            }
        });

        if(this.pcs.length == 0){
            this.endBattle(false);
        }
    }

    endBattle(victory:boolean){
        this._battleEnded = true;

        const eventData:BattleEndEvent = {
            defeatedPCs: this.defeatedPCs,
            survivingPCs: this.pcs,
            victory: victory
        };

        this.dispatch(CoopMonsterBattleEvent.BattleEnd,eventData);
    }

    //Really need to abstract these into a generic class somehow but maintain CoopMonsterBattleEvent restriction
    on(event:CoopMonsterBattleEvent,handler){
        if(!this._handlers[event]){
            this._handlers[event] = [];
        }

        this._handlers[event].push(handler);
    }

    off(event:CoopMonsterBattleEvent,handler){
        const handlers = this._handlers[event];

        if(handlers){
            for(var i = handlers.length - 1; i >= 0; i--) {
                if(handlers[i] == handler) {
                    handlers.splice(i, 1);
                }
            }
        }
    }

    dispatch(event:CoopMonsterBattleEvent,eventData){
        //is anyone even listening?
        if(this._handlers[event]){
            this._handlers[event].forEach(function(handler){
                try{
                    handler(eventData);
                }
                catch(ex){
                    winston.error('Error in handler',ex);
                }
            });
        }
    }
}
import PlayerCharacter from '../creature/player/PlayerCharacter';
import CreatureAIControlled from '../creature/CreatureAIControlled';
import WeaponAttack from '../item/WeaponAttack';
import WeaponAttackStep from '../item/WeaponAttackStep';
import IDamageSet from '../damage/IDamageSet';
import {damagesTotal} from '../damage/IDamageSet';
import AttackStep from '../item/WeaponAttackStep';

const winston = require('winston');

const ATTACK_TICK_MS = 10000;

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
    PlayerDeath,
    OpponentDefeated,
}

export interface OpponentDefeatedEvent{
    opponent:CreatureAIControlled;
    killer:PlayerCharacter;
}

export interface PlayersAttackedEvent{
    players:Array<PlayerDamaged>;
    message:string;
}

export interface PlayerAttackEvent{
    attackingPlayer:PlayerCharacter,
    damages:IDamageSet,
    opponent:CreatureAIControlled,
    message:string,
}

export interface PlayerBlockedEvent{
    pc:PlayerCharacter;
}

export interface PlayerDeathEvent{
    pc:PlayerCharacter;
    lostWishes:number;
}

export interface BattleEndEvent{
    defeatedPCs: Array<PlayerCharacter>;
    survivingPCs: Array<PlayerCharacter>;
    victory: boolean;
    xpEarned: number;
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
                battle: this,
                defeated: false,
                attackExhaustion: 1,//pc can't attack the mob until the mob attacks the pc
                blocking: false,
                queuedAttacks: [],
            };
        });

        this.opponent = opponent;

        this._handlers = [];

        this._attackTick = this._attackTick.bind(this);

        setTimeout(this._attackTick,ATTACK_TICK_MS/2);
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
            setTimeout(this._attackTick,ATTACK_TICK_MS);
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
            //damages calculates resistances
            const pcDamages:IDamageSet = attackStep.getDamages(this.opponent,pc);

            if(pc.currentBattleData.blocking){
                Object.keys(pcDamages).forEach(function(type){
                    pcDamages[type] = Math.floor(pcDamages[type] * (1-pc.damageBlocked));
                });

                const eventData:PlayerBlockedEvent = {
                    pc:pc
                };
            }

            pc.HPCurrent -= damagesTotal(pcDamages);

            eventData.players.push({
                pc:pc,
                damages:pcDamages,
                blocked:pc.currentBattleData.blocking,
            });

            pc.currentBattleData.blocking = false;
        });

        this.dispatch(CoopMonsterBattleEvent.PlayersAttacked,eventData);

        //check if anybody died
        this.pcs.forEach((pc:PlayerCharacter)=>{
            if(pc.HPCurrent < 1){
                const eventData:PlayerDeathEvent = {
                    pc: pc,
                    lostWishes: pc.calculateDeathWishesLost(),
                };

                this.pcs.splice(this.pcs.indexOf(pc),1);

                pc.currentBattleData.defeated = true;

                this.defeatedPCs.push(pc);
                
                this.dispatch(CoopMonsterBattleEvent.PlayerDeath,eventData);
            }
        });

        //drain a step of any queued attacks players have
        this.pcs.some((pc:PlayerCharacter)=>{
            //one queued attack per round
            if(pc.currentBattleData.queuedAttacks.length>0){
                const attackStep = pc.currentBattleData.queuedAttacks.shift();

                this._sendAttackStep(pc,attackStep);
            }

            //remove one exhaustion point each round
            if(pc.currentBattleData.attackExhaustion>0){
                pc.currentBattleData.attackExhaustion--;
            }

            return !this._battleEnded;
        });

        if(this.pcs.length == 0){
            this.endBattle(false);
        }
    }

    playerActionBlock(pc:PlayerCharacter){
        return new Promise((resolve,reject)=>{
            if(pc.currentBattleData.blocking){
                reject('You are already blocking');
            }
            else if(pc.currentBattleData.defeated){
                reject('You have already been defeated :(');
            }
            else if(pc.currentBattleData.attackExhaustion > 0){
                reject('You are too exhausted to block!');
            }
            else if(this.pcs.indexOf(pc)){
                reject('You are not in this battle');
            }
            else{
                pc.currentBattleData.attackExhaustion++;
                pc.currentBattleData.blocking = true;

                const eventData:PlayerBlockedEvent = {
                    pc:pc
                };

                this.dispatch(CoopMonsterBattleEvent.PlayerBlock,eventData);

                resolve();
            }
        });
    }

    playerActionAttack(pc:PlayerCharacter,attack:WeaponAttack){
        return new Promise((resolve,reject)=>{
            if(pc.currentBattleData.blocking){
                reject('You are currently blocking');
            }
            else if(pc.currentBattleData.defeated){
                reject('You have already been defeated :(');
            }
            else if(pc.currentBattleData.attackExhaustion > 0){
                reject('You are too exhausted to attack!');
            }
            else if(this.pcs.indexOf(pc)){
                reject('You are not in this battle');
            }
            else{
                this._sendAttackStep(pc,attack.steps[0]);

                if(!this._battleEnded && attack.steps.length>1){
                    pc.currentBattleData.queuedAttacks = attack.steps.slice(1);
                }

                resolve();
            }
        });
    }

    _sendAttackStep(pc:PlayerCharacter,step:AttackStep){
        const damages:IDamageSet = step.getDamages(pc,this.opponent);

        pc.currentBattleData.attackExhaustion += step.exhaustion;

        this.opponent.HPCurrent -= damagesTotal(damages);

        const eventData:PlayerAttackEvent = {
            attackingPlayer: pc,
            damages: damages,
            opponent: this.opponent,
            message: step.attackMessage
                .replace('{attacker}',pc.title)
                .replace('{defender}',this.opponent.title)
        };

        this.dispatch(CoopMonsterBattleEvent.PlayerAttack,eventData);

        if(this.opponent.HPCurrent<1){
            const eventData:OpponentDefeatedEvent = {
                killer:pc,
                opponent:this.opponent
            };

            this.dispatch(CoopMonsterBattleEvent.OpponentDefeated,eventData);

            this.endBattle(true);
        }
    }

    endBattle(victory:boolean){
        this._battleEnded = true;

        let xpEarned = 0;

        //Note: Game is responsible for listening for and adjusting player stats based on this event
        if(victory){
            xpEarned = this.opponent.xpDropped;
        }

        const eventData:BattleEndEvent = {
            defeatedPCs: this.defeatedPCs,
            survivingPCs: this.pcs,
            xpEarned: xpEarned, 
            victory: victory
        };

        this.dispatch(CoopMonsterBattleEvent.BattleEnd,eventData);

        //release players from the battle lock
        this.pcs.concat(this.defeatedPCs).forEach((pc)=>{
            pc.currentBattleData = null;
            pc.HPCurrent = pc.stats.HPTotal/10;
        });
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
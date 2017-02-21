import PlayerCharacter from '../creature/player/PlayerCharacter';
import CreatureAIControlled from '../creature/CreatureAIControlled';
import WeaponAttack from '../item/WeaponAttack';
import WeaponAttackStep from '../item/WeaponAttackStep';
import IDamageSet from '../damage/IDamageSet';
import {damagesTotal} from '../damage/IDamageSet';
import AttackStep from '../item/WeaponAttackStep';
import EventDispatcher from '../../util/EventDispatcher';
import { ATTACK_TICK_MS, IPlayerBattle, IBattlePlayer } from './IPlayerBattle';

const winston = require('winston');

const dummyAttack = new WeaponAttackStep({
    attackMessage: '{attacker} doesn\'t know what to do!',
    exhaustion: 1,
});

interface PlayerDamaged{
    bpc:IBattlePlayer,
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
    battle:IPlayerBattle;
    opponent:CreatureAIControlled;
    killer:IBattlePlayer;
}

export interface PlayersAttackedEvent{
    battle:IPlayerBattle;
    players:Array<PlayerDamaged>;
    message:string;
}

export interface PlayerAttackEvent{
    battle:IPlayerBattle;
    attacker:IBattlePlayer,
    damages:IDamageSet,
    opponent:CreatureAIControlled,
    message:string,
}

export interface PlayerBlockedEvent{
    battle:IPlayerBattle;
    bpc:IBattlePlayer;
}

export interface PlayerDeathEvent{
    battle:IPlayerBattle;
    bpc:IBattlePlayer;
    lostWishes:number;
}

export interface BattleEndEvent{
    battle:IPlayerBattle;
    pcs: Array<IBattlePlayer>;
    opponent: CreatureAIControlled;
    victory: boolean;
}

export default class CoopMonsterBattle implements IPlayerBattle{
    id:number;
    pcs:Map<string,IBattlePlayer>;
    opponent:CreatureAIControlled;
    _battleEnded:boolean;
    _currentAttack:WeaponAttack;
    _currentAttackStep:number;
    _events:EventDispatcher;

    constructor(id:number,pcs:Array<PlayerCharacter>,opponent:CreatureAIControlled){
        this._events = new EventDispatcher();

        this._battleEnded = false;

        this.id = id;

        this.pcs = new Map();
        
        pcs.forEach((pc)=>{
            this.pcs.set(pc.uid,{
                pc:pc,
                battle: this,
                blocking: false,
                defeated: false,
                exhaustion: 1,//pc can't attack the mob until the mob attacks the pc
                queuedAttacks: [],
            });

            pc.battle = this;
        });

        this.opponent = opponent;

        this._attackTick = this._attackTick.bind(this);

        setTimeout(this._attackTick,ATTACK_TICK_MS/2);
    }

    _attackTick(){   
        if(this._battleEnded){
            return;
        }

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

        setTimeout(this._attackTick,ATTACK_TICK_MS);
    }

    attackPlayers(attackStep:WeaponAttackStep){
        const eventData:PlayersAttackedEvent = {
            battle:this,
            players: [],
            message:attackStep.attackMessage
                .replace('{attacker}',this.opponent.title)
                .replace('{defender}','the party')
        };

        this.pcs.forEach((bpc)=>{
            if(bpc.defeated) return;

            //damages calculates resistances
            const pcDamages:IDamageSet = attackStep.getDamages(this.opponent,bpc.pc);

            if(bpc.blocking){
                Object.keys(pcDamages).forEach(function(type){
                    pcDamages[type] = Math.round(pcDamages[type] * (1-bpc.pc.damageBlocked));
                });

                const eventData:PlayerBlockedEvent = {
                    battle:this,
                    bpc:bpc
                };
            }

            bpc.pc.HPCurrent -= Math.round(damagesTotal(pcDamages));

            eventData.players.push({
                bpc:bpc,
                damages:pcDamages,
                blocked:bpc.blocking,
            });

            bpc.blocking = false;
        });

        this.dispatch(CoopMonsterBattleEvent.PlayersAttacked,eventData);

        //check if anybody died
        this.pcs.forEach((bpc:IBattlePlayer)=>{
            if(bpc.defeated) return;

            if(bpc.pc.HPCurrent < 1){
                const eventData:PlayerDeathEvent = {
                    battle: this,
                    bpc: bpc,
                    lostWishes: bpc.pc.calculateDeathWishesLost(),
                };

                bpc.defeated = true;
                
                this.dispatch(CoopMonsterBattleEvent.PlayerDeath,eventData);
            }
        });

        let allPlayersDefeated = true;

        this.pcs.forEach((bpc:IBattlePlayer)=>{
            if(this._battleEnded || bpc.defeated) return;

            allPlayersDefeated = false;

            if(bpc.queuedAttacks.length>0){
                const attackStep = bpc.queuedAttacks.shift();

                this._sendAttackStep(bpc,attackStep);
            }

            if(bpc.exhaustion>0){
                bpc.exhaustion--;
            }
        });

        if(allPlayersDefeated){
            this.endBattle(false);
        }
    }

    playerActionBlock(pc:PlayerCharacter){
        return (async()=>{
            const bpc = this.pcs.get(pc.uid);

            if(!bpc){
                throw 'You are not in in this battle';
            }

            if(bpc.blocking){
                throw 'You are already blocking';
            }

            if(bpc.defeated){
                throw 'You have already been defeated';
            }

            if(bpc.exhaustion > 0){
                throw 'You are too exhausted to block';
            }

            bpc.exhaustion++;
            bpc.blocking = true;

            const eventData:PlayerBlockedEvent = {
                battle:this,
                bpc: bpc
            };

            this.dispatch(CoopMonsterBattleEvent.PlayerBlock,eventData);
        })();
    }

    playerActionAttack(pc:PlayerCharacter,attack:WeaponAttack){
        return (async()=>{
            const bpc = this.pcs.get(pc.uid);

            if(!bpc){
                throw 'You are not in this battle';
            }
            
            if(bpc.defeated){
                throw 'You have already been defeated';
            }

            if(bpc.blocking){
                throw 'You are currently blocking';
            }

            if(bpc.exhaustion > 0){
                throw 'You are too exhausted to attack!';
            }

            this._sendAttackStep(bpc,attack.steps[0]);

            if(!this._battleEnded && attack.steps.length>1){
                bpc.queuedAttacks = attack.steps.slice(1);
            }
        })();
    }

    _sendAttackStep(bpc:IBattlePlayer,step:AttackStep){
        const damages:IDamageSet = step.getDamages(bpc.pc,this.opponent);

        bpc.exhaustion += step.exhaustion;

        this.opponent.HPCurrent -= Math.round(damagesTotal(damages));

        const eventData:PlayerAttackEvent = {
            battle: this,
            attacker: bpc,
            damages: damages,
            opponent: this.opponent,
            message: step.attackMessage
                .replace('{attacker}',bpc.pc.title)
                .replace('{defender}',this.opponent.title)
        };

        this.dispatch(CoopMonsterBattleEvent.PlayerAttack,eventData);

        if(this.opponent.HPCurrent<1){
            const eventData:OpponentDefeatedEvent = {
                battle:this,
                killer:bpc,
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

        const bpcs = [];

        this.pcs.forEach(function(bpc){
            bpcs.push({
                bpc: bpc,
                xpEarned: xpEarned,
            });
        });

        const eventData:BattleEndEvent = {
            battle:this,
            pcs: bpcs,
            opponent: this.opponent,
            victory: victory
        };

        this.dispatch(CoopMonsterBattleEvent.BattleEnd,eventData);

        //release players from the battle lock
        this.pcs.forEach((pc)=>{
            pc.battle = null;
        });
    }

    getPlayerExhaustion(pc:PlayerCharacter):number{
        const bpc = this.pcs.get(pc.uid);

        //Caller's problem, they should have checked first
        if(!bpc){
            throw `${pc.title} is not in this battle!`;
        }

        return bpc.exhaustion;
    }

    //Event methods
    on(event:CoopMonsterBattleEvent,handler:Function){ this._events.on(event,handler); }
    off(event:CoopMonsterBattleEvent,handler:Function){ this._events.off(event,handler); }
    dispatch<T>(event:CoopMonsterBattleEvent,eventData:T){ this._events.dispatch(event,eventData); }
}
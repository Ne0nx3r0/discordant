import WeaponAttack from '../item/WeaponAttack';
import WeaponAttackStep from '../item/WeaponAttackStep';
import PlayerCharacter from '../creature/player/PlayerCharacter';
import Creature from '../creature/Creature';
import IDamageSet from '../damage/IDamageSet';
import CreatureAIControlled from '../creature/CreatureAIControlled';
import EventDispatcher from '../../util/EventDispatcher';

export const ATTACK_TICK_MS = 10000;

export default class PlayerBattle{
    id:number;
    bpcs:Map<string,IBattlePlayerCharacter>;
    _battleEnded:boolean;
    _events:EventDispatcher;

    constructor(id:number,pcs:Array<PlayerCharacter>){
        this.id = id;
        this._battleEnded = false;
        this._events = new EventDispatcher();

        this.bpcs = new Map();
        
        pcs.forEach((pc)=>{
            this.bpcs.set(pc.uid,{
                pc:pc,
                battle: this,
                blocking: false,
                defeated: false,
                exhaustion: 1,//pc can't attack the mob until the mob attacks the pc
                queuedAttacks: [],
            });

            pc.battle = this;
        });
    }

    playerActionAttack(pc:PlayerCharacter,attack:WeaponAttack){
        return (async()=>{
            const bpc = this.bpcs.get(pc.uid);

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

    _sendAttackStep(bpc:IBattlePlayerCharacter,step:WeaponAttackStep){
        throw 'Player battle classes must implement _sendAttackStep!';
    }

    playerActionBlock(pc:PlayerCharacter){
        return (async()=>{
            const bpc = this.bpcs.get(pc.uid);

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

            const eventData:IBattleBlockEvent = {
                battle:this,
                blocker:bpc,
            };

            this.dispatch(BattleEvent.Block,eventData);
        })();
    }

    getPlayerExhaustion(pc:PlayerCharacter):number{
        let bpc = this.bpcs.get(pc.uid);

        if(bpc){
            return bpc.exhaustion;
        }

        //Caller's problem, they shouldn't have sent an invalid player
        throw `${pc.title} is not in this battle!`;
    }

    //Event methods
    on(event:BattleEvent,handler:Function){ this._events.on(event,handler); }
    off(event:BattleEvent,handler:Function){ this._events.off(event,handler); }
    dispatch<T>(event:BattleEvent,eventData:T){ this._events.dispatch(event,eventData); }
}

export enum BattleEvent{
    RoundBegin,
    Attack,
    Block,
    PlayerDefeated,
    PvPBattleEnd,
    CoopBattleEnd,
}

export interface IBattlePlayerCharacter{
    pc:PlayerCharacter;
    battle:PlayerBattle;
    blocking:boolean;
    defeated:boolean;
    exhaustion:number;
    queuedAttacks:Array<WeaponAttackStep>;
}

export interface IAttacked{
    creature: Creature;
    damages: IDamageSet;
    blocked: boolean;
    exhaustion: number;
}

export interface IBattleRoundBeginEvent{
    battle: PlayerBattle;
}

export interface IBattleAttackEvent{
    attacker: Creature;
    battle: PlayerBattle;
    attackStep: WeaponAttackStep;
    attacked: Array<IAttacked>;
}

export interface IBattleBlockEvent{
    battle:PlayerBattle;
    blocker:IBattlePlayerCharacter;
}

export interface IBattlePlayerDefeatedEvent{
    battle: PlayerBattle;
    player: IBattlePlayerCharacter;
}

export interface IPvPBattleEndEvent{
    battle:PlayerBattle;
    winner:IBattlePlayerCharacter;
    loser:IBattlePlayerCharacter;
}

export interface ICoopBattleEndEvent{
    battle:PlayerBattle;
    players: Array<IBattlePlayerCharacter>;
    opponent:CreatureAIControlled;
    victory:boolean;
    killer?:IBattlePlayerCharacter;
}
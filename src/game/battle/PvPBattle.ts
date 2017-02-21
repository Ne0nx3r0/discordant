import PlayerCharacter from '../creature/player/PlayerCharacter';
import { IBattleAttackEvent, IBattlePlayer, IPlayerBattle, ATTACK_TICK_MS, IBattleAttacked, IBattleRoundBeginEvent, BattleEvent } from './IPlayerBattle';
import WeaponAttack from '../item/WeaponAttack';
import EventDispatcher from '../../util/EventDispatcher';
import WeaponAttackStep from '../item/WeaponAttackStep';
import IDamageSet from '../damage/IDamageSet';
import {damagesTotal} from '../damage/IDamageSet';
import PlayerBattle from './PlayerBattle';

export default class PvPBattle extends PlayerBattle{
    id:number;
    bpcs:Array<IBattlePlayer>;
    _events:EventDispatcher;
    _battleEnded:boolean;
    
    constructor(id:number,pc1:PlayerCharacter,pc2:PlayerCharacter){
        this.id = id;
        this._battleEnded = false;

        this.bpcs = [{
            battle:this,
            pc:pc1,
            blocking:false,
            defeated:false,
            exhaustion:1,
            queuedAttacks:[],
        },{
            battle:this,
            pc:pc2,
            blocking:false,
            defeated:false,
            exhaustion:1,
            queuedAttacks:[],
        }];

        this._events = new EventDispatcher();

        setTimeout(this.tick.bind(this),ATTACK_TICK_MS);
    }

    tick(){
        if(this._battleEnded){
            return;
        }

//Dispatch round begin
        const eventData:PvPBattleRoundBeginEvent = {
            battle:this
        };

        this.dispatch(IBattleRoundBeginEvent,eventData);

//sort attackers and send any queued attacks
        const orderedAttacks = whoGoesFirst(this.bpcs[0],this.bpcs[1]);
        const bpc1 = orderedAttacks[0];
        const bpc2 = orderedAttacks[1];

        if(bpc1.queuedAttacks){
            const attackStep = bpc1.queuedAttacks.shift();

            this._sendAttackStep(bpc1,attackStep,bpc2);
        }
         if(bpc2.queuedAttacks){
            const attackStep = bpc2.queuedAttacks.shift();

            this._sendAttackStep(bpc2,attackStep,bpc1);
        }

        this.bpcs.forEach(function(bpc){
            if(bpc.exhaustion>0){
                bpc.exhaustion--;
            }
            if(bpc.blocking){
                bpc.blocking = false;
            }
        });

        if(!this._battleEnded){
            setTimeout(this.tick.bind(this),ATTACK_TICK_MS);
        }
    }

    _sendAttackStep(attacker:IBattlePlayer,step:WeaponAttackStep){
        const damages:IDamageSet = step.getDamages(attacker.pc,defender.pc);

        attacker.exhaustion += step.exhaustion;

        defender.pc.HPCurrent -= Math.round(damagesTotal(damages));

        const bpc1EventData:IBattleAttackEvent = {
            battle:this,
            message: step.attackMessage
                .replace('{attacker}',attacker.pc.title)
                .replace('{defender}',defender.pc.title),
            attacked: [{
                creature: defender.pc,
                damages: damages,
                blocked: defender.blocking,
                exhaustion: defender.exhaustion,
            }],
        };

        this.dispatch(PvPBattleEvent.PlayerAttack,bpc1EventData);

        if(defender.pc.HPCurrent<1){
            this.endBattle(attacker,defender);
        }
    }

    endBattle(winner:IBattlePlayer,loser:IBattlePlayer){
        this._battleEnded = true;

        const eventData:PvPBattleEndEvent = {
            battle: this,
            winner: winner,
            loser: loser,
        };

        this.dispatch(PvPBattleEvent.BattleEnd,eventData);

        //release players from the battle lock
        winner.pc.battle = null;
        winner.pc.status = 'inCity';
        
        loser.pc.battle = null;
        loser.pc.status = 'inCity';
    }
}

export interface PvPBattleRoundBeginEvent{
    battle:IPlayerBattle;
}

export interface PvPBattleEndEvent{
    battle:IPlayerBattle;
    winner:IBattlePlayer;
    loser:IBattlePlayer;
}

export interface PvPBattlePlayerBlockEvent{
    battle:IPlayerBattle;
}

//Whoever is more exhausted or a random agility-based chance
function whoGoesFirst(bpc1:IBattlePlayer,bpc2:IBattlePlayer):Array<IBattlePlayer>{
    const firstPlayer = [bpc1,bpc2];
    const secondPlayer = [bpc2,bpc1];

    if(bpc1.exhaustion == bpc2.exhaustion){
        if(bpc1.pc.stats.Agility * Math.random() > bpc2.pc.stats.Agility * Math.random()){
            return firstPlayer;
        }
        return secondPlayer;
    }

    return bpc1.exhaustion > bpc2.exhaustion ? secondPlayer : firstPlayer;
}
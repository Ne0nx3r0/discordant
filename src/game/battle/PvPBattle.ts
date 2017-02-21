import PlayerCharacter from '../creature/player/PlayerCharacter';
import { IBattleAttackEvent, ATTACK_TICK_MS, IBattleRoundBeginEvent, BattleEvent, IBattlePlayerCharacter, IPvPBattleEndEvent } from './PlayerBattle';
import WeaponAttack from '../item/WeaponAttack';
import EventDispatcher from '../../util/EventDispatcher';
import WeaponAttackStep from '../item/WeaponAttackStep';
import IDamageSet from '../damage/IDamageSet';
import {damagesTotal} from '../damage/IDamageSet';
import PlayerBattle from './PlayerBattle';

export default class PvPBattle extends PlayerBattle{
    constructor(id:number,pc1:PlayerCharacter,pc2:PlayerCharacter){
        super(id,[pc1,pc2]);

        setTimeout(this.tick.bind(this),ATTACK_TICK_MS);
    }

    tick(){
        if(this._battleEnded){
            return;
        }

//Dispatch round begin
        const eventData:IBattleRoundBeginEvent = {
            battle:this
        };

        this.dispatch(BattleEvent.RoundBegin,eventData);

//sort attackers and send any queued attacks
        const orderedAttacks = whoGoesFirst(this.bpcs[0],this.bpcs[1]);
        const bpc1 = orderedAttacks[0];
        const bpc2 = orderedAttacks[1];

        if(bpc1.queuedAttacks){
            const attackStep = bpc1.queuedAttacks.shift();

            this._sendAttackStep(bpc1,attackStep);
        }
         if(bpc2.queuedAttacks){
            const attackStep = bpc2.queuedAttacks.shift();

            this._sendAttackStep(bpc2,attackStep);
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

    _sendAttackStep(attacker:IBattlePlayerCharacter,step:WeaponAttackStep){
        let defender:IBattlePlayerCharacter;

        this.bpcs.forEach(function(bpc:IBattlePlayerCharacter){
            if(bpc.pc.uid != attacker.pc.uid){
                defender = bpc;
            }
        });

        const damages:IDamageSet = step.getDamages(attacker.pc,defender.pc);

        attacker.exhaustion += step.exhaustion;

        defender.pc.HPCurrent -= Math.round(damagesTotal(damages));

        const bpc1EventData:IBattleAttackEvent = {
            attacker:attacker.pc,
            battle:this,
            attackStep:step,
            attacked: [{
                creature: defender.pc,
                damages: damages,
                blocked: defender.blocking,
                exhaustion: defender.exhaustion,
            }],
        };

        this.dispatch(BattleEvent.Attack,bpc1EventData);

        if(defender.pc.HPCurrent<1){
            this.endBattle(attacker,defender);
        }
    }

    endBattle(winner:IBattlePlayerCharacter,loser:IBattlePlayerCharacter){
        this._battleEnded = true;

        const eventData:IPvPBattleEndEvent = {
            battle: this,
            winner: winner,
            loser: loser,
        };

        this.dispatch(BattleEvent.PvPBattleEnd,eventData);

        //release players from the battle lock
        winner.pc.battle = null;
        winner.pc.status = 'inCity';
        
        loser.pc.battle = null;
        loser.pc.status = 'inCity';
    }
}

//Whoever is more exhausted or a random agility-based chance
function whoGoesFirst(bpc1:IBattlePlayerCharacter,bpc2:IBattlePlayerCharacter):Array<IBattlePlayerCharacter>{
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
import PlayerCharacter from '../creature/player/PlayerCharacter';
import { IBattleAttackEvent, ATTACK_TICK_MS, IBattleRoundBeginEvent, BattleEvent, IBattlePlayerCharacter, IPvPBattleEndEvent } from './PlayerBattle';
import WeaponAttack from '../item/WeaponAttack';
import EventDispatcher from '../../util/EventDispatcher';
import WeaponAttackStep from '../item/WeaponAttackStep';
import IDamageSet from '../damage/IDamageSet';
import {damagesTotal} from '../damage/IDamageSet';
import PlayerBattle from './PlayerBattle';
import {DiscordTextChannel} from '../../bot/Bot';

export default class PvPBattle extends PlayerBattle{
    bpc1:IBattlePlayerCharacter;
    bpc2:IBattlePlayerCharacter;

    constructor(id:number,channel:DiscordTextChannel,pc1:PlayerCharacter,pc2:PlayerCharacter){
        super(id,channel,[pc1,pc2]);

        this.bpc1 = this.bpcs.get(pc1.uid);
        this.bpc2 = this.bpcs.get(pc2.uid);

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
        const orderedAttacks = [this.bpc1,this.bpc2].sort(whoGoesFirst);
        const bpc1 = orderedAttacks[0];
        const bpc2 = orderedAttacks[1];

        if(bpc1.queuedAttacks.length>0){
            const attackStep = bpc1.queuedAttacks.shift();

            this._sendAttackStep(bpc1,attackStep);
        }
         if(bpc2.queuedAttacks.length>0){
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
            message:step.attackMessage
                .replace('{attacker}',attacker.pc.title)
                .replace('{defender}',defender.pc.title),
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

        setTimeout(()=>{
            this.channel.delete();
        },5000);
    }
}

//Lowest exhaustion or random agility-based goes first
function whoGoesFirst(a:IBattlePlayerCharacter,b:IBattlePlayerCharacter){
    if(a.exhaustion == b.exhaustion){
        return b.pc.stats.Agility * Math.random() - a.pc.stats.Agility * Math.random();
    }

    return a.exhaustion - b.exhaustion;
}
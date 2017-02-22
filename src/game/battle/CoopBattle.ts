import PlayerCharacter from '../creature/player/PlayerCharacter';
import CreatureAIControlled from '../creature/CreatureAIControlled';
import WeaponAttack from '../item/WeaponAttack';
import WeaponAttackStep from '../item/WeaponAttackStep';
import IDamageSet from '../damage/IDamageSet';
import {damagesTotal} from '../damage/IDamageSet';
import AttackStep from '../item/WeaponAttackStep';
import EventDispatcher from '../../util/EventDispatcher';
import PlayerBattle from './PlayerBattle';
import { IBattlePlayerCharacter, ICoopBattleEndEvent, ATTACK_TICK_MS, BattleEvent, IBattleAttackEvent, IBattlePlayerDefeatedEvent, IBattleBlockEvent, IAttacked } from './PlayerBattle';
import {DiscordTextChannel} from '../../bot/Bot';
import BattleMessengerDiscord from './BattleMessengerDiscord';

const winston = require('winston');

const dummyAttack = new WeaponAttackStep({
    attackMessage: '{attacker} doesn\'t know what to do!',
    exhaustion: 1,
});

interface PlayerDamaged{
    bpc:IBattlePlayerCharacter,
    damages:IDamageSet,
    blocked:boolean,
}

export enum CoopBattleEvent{
    PlayerAttack,
    PlayerBlock,
    PlayersAttacked,
    BattleEnd,
    PlayerDeath,
    OpponentDefeated,
}

export default class CoopBattle extends PlayerBattle{
    opponent:CreatureAIControlled;
    _opponentCurrentAttack:WeaponAttack;
    _opponentCurrentAttackStep:number;

    constructor(id:number,channel:DiscordTextChannel,pcs:Array<PlayerCharacter>,opponent:CreatureAIControlled){
        super(id,channel,pcs);

        this.opponent = opponent;

        this._attackTick = this._attackTick.bind(this);

        BattleMessengerDiscord(this,channel);

        setTimeout(this._attackTick,ATTACK_TICK_MS/2);
    }

    _attackTick(){   
        if(this._battleEnded){
            return;
        }

        if(!this._opponentCurrentAttack){
            this._opponentCurrentAttack = this.opponent.getRandomAttack();
            this._opponentCurrentAttackStep = 0;
        }

        let attackStep;

        if(this._opponentCurrentAttack){    
            attackStep = this._opponentCurrentAttack.steps[this._opponentCurrentAttackStep++];
    
            if(this._opponentCurrentAttack.steps.length >= this._opponentCurrentAttackStep){
                this._opponentCurrentAttack = null;
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
        const survivingPlayers:Array<IBattlePlayerCharacter> = [];
        
        this.bpcs.forEach(function(bpc){
            if(!bpc.defeated){
                survivingPlayers.push(bpc);
            }
        });

        const playerToAttack = survivingPlayers[Math.floor(Math.random() * survivingPlayers.length)];

        const eventData:IBattleAttackEvent = {
            attacker: this.opponent,
            battle:this,
            attacked: [] as Array<IAttacked>,
            message:attackStep.attackMessage
                .replace('{attacker}',this.opponent.title)
                .replace('{defender}',playerToAttack.pc.title)
        };

        //damages calculates resistances
        const pcDamages:IDamageSet = attackStep.getDamages(this.opponent,playerToAttack.pc);

        if(playerToAttack.blocking){
            Object.keys(pcDamages).forEach(function(type){
                pcDamages[type] = Math.round(pcDamages[type] * (1-playerToAttack.pc.damageBlocked));
            });

            const eventData:IBattleBlockEvent = {
                battle:this,
                blocker:playerToAttack
            };
        }

        playerToAttack.pc.HPCurrent -= Math.round(damagesTotal(pcDamages));

        eventData.attacked.push({
            creature:playerToAttack.pc,
            damages:pcDamages,
            blocked:playerToAttack.blocking,
            exhaustion:playerToAttack.exhaustion,
        });

        this.dispatch(BattleEvent.Attack,eventData);

//check if anybody died
        this.bpcs.forEach((bpc:IBattlePlayerCharacter)=>{
            if(bpc.defeated) return;

            if(bpc.pc.HPCurrent < 1){
                const eventData:IBattlePlayerDefeatedEvent = {
                    battle: this,
                    player: bpc,
                };

                bpc.defeated = true;
                
                this.dispatch(BattleEvent.PlayerDefeated,eventData);
            }
        });

//Check if all players were defeated while updating their statuses
        let allPlayersDefeated = true;

        this.bpcs.forEach((bpc:IBattlePlayerCharacter)=>{
            if(this._battleEnded || bpc.defeated) return;

            allPlayersDefeated = false;

            if(bpc.queuedAttacks.length>0){
                const attackStep = bpc.queuedAttacks.shift();

                this._sendAttackStep(bpc,attackStep);
            }

            if(bpc.exhaustion>0){
                bpc.exhaustion--;
            }

            bpc.blocking = false;
        });

        if(allPlayersDefeated){
            this.endBattle(false);
        }
    }

    _sendAttackStep(bpc:IBattlePlayerCharacter,step:AttackStep){
        const damages:IDamageSet = step.getDamages(bpc.pc,this.opponent);

        bpc.exhaustion += step.exhaustion;

        this.opponent.HPCurrent -= Math.round(damagesTotal(damages));

        const eventData:IBattleAttackEvent = {
            attacker: bpc.pc,
            battle: this,
            message:step.attackMessage
                .replace('{defender}',this.opponent.title)
                .replace('{attacker}',bpc.pc.title),
            attacked: [{
                creature: this.opponent,
                damages: damages,
                blocked: false,
                exhaustion: 0,
            }],
        };

        this.dispatch(BattleEvent.Attack,eventData);

        if(this.opponent.HPCurrent<1){
            this.endBattle(true,bpc);
        }
    }

    endBattle(victory:boolean,killer?:IBattlePlayerCharacter){
        this._battleEnded = true;

        let xpEarned = 0;

        //Note: Game is responsible for listening for and adjusting player stats based on this event
        if(victory){
            xpEarned = this.opponent.xpDropped;
        }

        const bpcs = [];

        this.bpcs.forEach(function(bpc){
            bpcs.push({
                bpc: bpc,
                xpEarned: xpEarned,
            });
        });

        const eventData:ICoopBattleEndEvent = {
            battle:this,
            players: bpcs,
            opponent: this.opponent,
            victory: victory,
            killer: killer,
        };

        this.dispatch(BattleEvent.CoopBattleEnd,eventData);

        //release players from the battle lock
        this.bpcs.forEach((pc)=>{
            pc.battle = null;
        });
    }

    getPlayerExhaustion(pc:PlayerCharacter):number{
        const bpc = this.bpcs.get(pc.uid);

        //Caller's problem, they should have checked first
        if(!bpc){
            throw `${pc.title} is not in this battle!`;
        }

        return bpc.exhaustion;
    }
}
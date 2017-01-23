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

export enum CoopMonsterBattleEvent{
    PlayerAttack,
    PlayerBlock,
    PlayersAttacked,
    BattleEnd,
    PlayerDeath
}

interface PlayerDamaged{
    pc:PlayerCharacter,
    damages:IDamageSet,
}

interface PlayersAttackedEventData{
    damages:Array<PlayerDamaged>;
}

export default class CoopMonsterBattle{
    id:number;
    pcs:Array<PlayerCharacter>;
    opponent:CreatureAIControlled;
    handlers:Array<Array<Function>>;

    currentAttack:WeaponAttack;
    currentAttackStep:number;

    constructor(id:number,pcs:Array<PlayerCharacter>,opponent:CreatureAIControlled){
        this.id = id;
        this.pcs = pcs;

        this.pcs.forEach((pc)=>{
            pc.currentBattleData = {
                battle: this
            };
        });

        this.opponent = opponent;

        this.handlers = [];

        this.attackTick();
    }

    attackTick(){   
        if(!this.currentAttack){
            this.currentAttack = this.opponent.getRandomAttack();
            this.currentAttackStep = 0;
        }

        let attackStep;

        if(this.currentAttack){    
            attackStep = this.currentAttack.steps[this.currentAttackStep++];
    
            if(this.currentAttack.steps.length >= this.currentAttackStep){
                this.currentAttack = null;
            }   
        }
        //Didn't find an elgible attack
        else{
            attackStep = dummyAttack;
        }

        this.attackPlayers(attackStep);

        setTimeout(this.attackTick.bind(this),attackStep.cooldown);        
    }

    attackPlayers(attackStep:WeaponAttackStep){
        const eventData:PlayersAttackedEventData = {
            damages: []
        };

        this.pcs.forEach((pc)=>{
            const pcDamages:IDamageSet = attackStep.getDamages(this.opponent,pc);

            //Reduce damage by player's resistance to it
            Object.keys(pcDamages).forEach(function(damageType){
                //Resistance = 0.0 (0%) to 0.9 (90%) damage reduction 
                pcDamages[damageType] = Math.round( pcDamages[damageType] * (1-pc.stats.Resistances[damageType]) );
            });

            eventData.damages.push({
                pc:pc,
                damages:pcDamages
            });
        });

        this.dispatch(CoopMonsterBattleEvent.PlayersAttacked,eventData);
    }







    //Really need to abstract these into a generic class somehow but maintain CoopMonsterBattleEvent restriction
    on(event:CoopMonsterBattleEvent,handler){
        this.handlers[event].push(handler);
    }

    off(event:CoopMonsterBattleEvent,handler){
        const handlers = this.handlers[event];

        for(var i = handlers.length - 1; i >= 0; i--) {
            if(handlers[i] == handler) {
                handlers.splice(i, 1);
            }
        }
    }

    dispatch(event:CoopMonsterBattleEvent,eventData){
        this.handlers[event].forEach(function(handler){
            try{
                handler(eventData);
            }
            catch(ex){
                winston.error('Error in handler',ex);
            }
        });
    }
}
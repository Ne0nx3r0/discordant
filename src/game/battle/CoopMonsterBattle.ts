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
        const eventData = {};

        this.pcs.forEach((pc)=>{
            const pcDamages = attackStep.getDamages(this.opponent,pc);

            const pcResistances = pc.stats.Resistances;

            
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
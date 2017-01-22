import PlayerCharacter from '../creature/player/PlayerCharacter';
import Creature from '../creature/Creature';
const winston = require('winston');

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
    opponent:Creature;
    handlers:Array<Array<Function>>;

    constructor(id:number,pcs:Array<PlayerCharacter>,opponent:Creature){
        this.id = id;
        this.pcs = pcs;

        this.pcs.forEach((pc)=>{
            pc.currentBattleData = {
                battle: this
            };
        });

        this.opponent = opponent;

        this.handlers = [];

        

        need to implement monster auto-attacks

        then work on player attacks

        then player blocks
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
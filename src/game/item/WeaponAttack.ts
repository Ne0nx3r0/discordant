import Creature from '../creature/Creature';
import WeaponAttackStep from './WeaponAttackStep';

interface AIShouldUseFunc{
    (attacker:Creature):boolean;
}

export default class WeaponAttack{
    title:string;
    steps:Array<WeaponAttackStep>;

    //1-100 weighted chance AI will use this attack
    aiUseWeight:number;

    //is now an appropriate time to use this attack?
    //master is in the case where this is a pet
    aiShouldIUseThisAttack:AIShouldUseFunc;

    constructor(title:string,steps:Array<WeaponAttackStep>,aiUseWeight:number,aiShouldUseFunc?:AIShouldUseFunc){
        this.title = title;
        this.steps = steps;
        this.aiUseWeight = aiUseWeight;
        this.aiShouldIUseThisAttack = aiShouldUseFunc || function(attacker:Creature){return true};
    }
}
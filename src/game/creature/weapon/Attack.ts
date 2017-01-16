import ICreature from '../ICreature';
import AttackStep from './AttackStep';

interface AIShouldUseFunc{
    (attacker:ICreature,defender:ICreature,master?:ICreature):boolean;
}

export default class Attack{
    title:string;
    steps:Array<AttackStep>;

    //1-100 weighted chance AI will use this attack
    aiUseWeight:number;

    //is now an appropriate time to use this attack?
    //master is in the case where this is a pet
    aiShouldUseFunc:AIShouldUseFunc;

    aiShouldUse(attacker:ICreature,defender:ICreature,master?:ICreature){
        return this.aiShouldUse;
    }

    constructor(title:string,steps:Array<AttackStep>,aiUseWeight:number,aiShouldUseFunc?:AIShouldUseFunc){
        this.title = title;
        this.steps = steps;
        this.aiUseWeight = aiUseWeight;
        this.aiShouldUseFunc = aiShouldUseFunc || function(attacker:ICreature,defender:ICreature,master?:ICreature){return true};
    }
}
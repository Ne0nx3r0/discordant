import DamageSet from '../damage/DamageSet';
import ICreature from '../ICreature';
import Weapon from './Weapon';

interface DamageFunc{
    (     
        attacker:ICreature,
        defender:ICreature,
        weapon:Weapon,
        master?:ICreature
    ):DamageSet;
}

export default class AttackStep{
    attackMessage:string;
    cooldown:number;
    damageFunc:DamageFunc;

    constructor(attackMessage:string,cooldown:number,damageFunc:DamageFunc){
        this.attackMessage = attackMessage;
        this.cooldown = cooldown;
        this.damageFunc = damageFunc;
    }

    getDamages(attacker:ICreature,defender:ICreature,weapon:Weapon,master?:ICreature){
        return this.damageFunc(attacker,defender,weapon,master);
    }
}
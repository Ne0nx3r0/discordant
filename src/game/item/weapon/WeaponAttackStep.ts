import DamageSet from '../../damage/DamageSet';
import Creature from '../../creature/Creature';
import Weapon from './Weapon';

interface DamageFunc{
    (     
        attacker:Creature,
        defender:Creature,
        weapon:Weapon,
        master?:Creature
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

    getDamages(attacker:Creature,defender:Creature,weapon:Weapon,master?:Creature){
        return this.damageFunc(attacker,defender,weapon,master);
    }
}
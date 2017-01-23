import IDamageSet from '../../damage/IDamageSet';
import Creature from '../../creature/Creature';
import Weapon from './Weapon';

interface DamageFunc{
    (     
        attacker:Creature,
        defender:Creature,
        master?:Creature
    ):IDamageSet;
}

export default class AttackStep{
    attackMessage:string;
    cooldown:number;
    getDamages:DamageFunc;

    constructor(attackMessage:string,cooldown:number,damageFunc?:DamageFunc){
        this.attackMessage = attackMessage;
        this.cooldown = cooldown;
        this.getDamages = damageFunc;
    }
}
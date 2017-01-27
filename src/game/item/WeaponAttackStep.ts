import IDamageSet from '../damage/IDamageSet';
import Creature from '../creature/Creature';
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
    exhaustion:number;
    getDamages:DamageFunc;

    constructor(attackMessage:string,exhaustion:number,damageFunc?:DamageFunc){
        this.attackMessage = attackMessage;
        this.exhaustion = exhaustion;
        this.getDamages = damageFunc;
    }
}
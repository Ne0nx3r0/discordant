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

export interface WeaponAttackStepBag{
    attackMessage:string;
    exhaustion:number;
    damageFunc?:DamageFunc;
}

export default class WeaponAttackStep{
    attackMessage:string;
    exhaustion:number;
    getDamages:DamageFunc;

    constructor(bag:WeaponAttackStepBag){
        this.attackMessage = bag.attackMessage;
        this.exhaustion = bag.exhaustion;
        this.getDamages = bag.damageFunc;
    }
}
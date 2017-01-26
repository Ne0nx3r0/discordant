import WeaponAttack from './WeaponAttack';
import Creature from '../../creature/Creature';
import ItemEquippable from '../ItemEquippable';
import {EquipmentSlotType} from '../CreatureEquipment';

interface useRequirements{
    Strength?:number,
    Agility?:number,
    Vitality?:number,
    Spirit?:number,
    Luck?:number,
    Class?:number,
}

export default class Weapon extends ItemEquippable{
    attacks:Array<WeaponAttack>;
    useRequirements:useRequirements;

    constructor(id:number,title:string,description:string,useRequirements:useRequirements,attacks:Array<WeaponAttack>){
        super(id,title,description,EquipmentSlotType.Weapon);

        this.attacks = attacks;
        this.useRequirements = useRequirements || {};
    }

    findAttack(attackName:string):WeaponAttack{
        for(var i=0;i<this.attacks.length;i++){
            const attack = this.attacks[i];

            if(attack.title.toUpperCase() == attackName){
                return attack;
            }
        }

        return null;
    }
}
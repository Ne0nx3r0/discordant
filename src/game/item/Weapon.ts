import WeaponAttack from './WeaponAttack';
import Creature from '../creature/Creature';
import ItemEquippable from './ItemEquippable';
import {ItemEquippableBag} from './ItemEquippable';
import {EquipmentSlot} from './CreatureEquipment';

interface useRequirements{
    Strength?:number,
    Agility?:number,
    Vitality?:number,
    Spirit?:number,
    Luck?:number,
    Class?:number,
}

interface ItemWeaponBag{
    id:number;
    title:string;
    description:string;
    hiddenDescription?:string;
    hiddenDescriptionLoreNeeded?:number;
    damageBlocked:number;
    useRequirements:useRequirements;
    attacks:Array<WeaponAttack>;
}

export default class Weapon extends ItemEquippable{
    attacks:Array<WeaponAttack>;
    useRequirements:useRequirements;
    damageBlocked:number;//0.0 to 0.5 describing how much damage this weapon blocks when the player blocks

    constructor(bag:ItemWeaponBag){
        super({
            id:bag.id,
            title:bag.title,
            description:bag.description,
            hiddenDescription:bag.hiddenDescription,
            hiddenDescriptionLoreNeeded:bag.hiddenDescriptionLoreNeeded,
            slotType:'weapon'//also offhandweapon, but for our purposes they are all primary's
        });

        this.damageBlocked = bag.damageBlocked;
        this.attacks = bag.attacks;
        this.useRequirements = bag.useRequirements || {};
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
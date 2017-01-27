import ItemBase from './ItemBase';
import {EquipmentSlotType} from '../item/CreatureEquipment';
import DamageSet from '../damage/IDamageSet';
import Creature from '../creature/Creature';
import Weapon from './Weapon';
import IStatSet from '../creature/Creature';

export default class ItemEquippable extends ItemBase{
    slotType:EquipmentSlotType;

    constructor(id:number,title:string,description:string,slotType:EquipmentSlotType){
        super(id,title,description);

        this.slotType = slotType;
    }

    //Modifies the damageset if bonuses/penalties apply
    /*onAttack(currentDamages:DamageSet,wearer:Creature,wearerWeapon:Weapon,defender:Creature):DamageSet{
        return;
    }not implemented yet
    */

    //Modifies the damageset if bonuses/penalties apply
    /*onDefend(currentDamages:DamageSet,wearer:Creature,attacker:Creature):DamageSet{
        return;
    }not implemented yet
    */

    //Modifies the statset if bonuses/penalties apply
    onAddBonuses(stats:IStatSet){
        return;
    }
}
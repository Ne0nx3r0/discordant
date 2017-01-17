import ItemBase from './ItemBase';
import {EquipmentSlot} from '../creature/CreatureEquipment';
import DamageSet from '../damage/DamageSet';
import Creature from '../creature/Creature';
import Weapon from './weapon/Weapon';
import IStatSet from '../creature/IStatSet';

export default class ItemEquippable extends ItemBase{
    slot:EquipmentSlot;

    constructor(id:number,title:string,description:string,slot:EquipmentSlot){
        super(id,title,description);

        this.slot = slot;
    }

    //Modifies the damageset if bonuses/penalties apply
    onAttack(currentDamages:DamageSet,wearer:Creature,wearerWeapon:Weapon,defender:Creature):DamageSet{
        return;
    }

    //Modifies the damageset if bonuses/penalties apply
    onDefend(currentDamages:DamageSet,wearer:Creature,attacker:Creature):DamageSet{
        return;
    }

    //Modifies the statset if bonuses/penalties apply
    onAddBonuses(stats:IStatSet){
        return;
    }
}
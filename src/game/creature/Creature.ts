import CreatureType from './CreatureType';
import DamageSet from '../damage/IDamageSet';
import Weapon from '../item/weapon/Weapon';
import AttributeSet from './AttributeSet';
import CreatureEquipment from '../item/CreatureEquipment';
import {EquipmentSlot} from '../item/CreatureEquipment';
import IStatSet from './IStatSet';
import ItemEquippable from '../item/ItemEquippable';
import CreatureId from './CreatureId';

export interface ICreatureBag{
    id:CreatureId;
    title:string;
    description:string;
    attributes:AttributeSet;
    equipment: CreatureEquipment;
}

export default class Creature{
    id:CreatureId;
    title:string;
    description:string;
    attributes:AttributeSet;
    equipment:CreatureEquipment;
    hpCurrent:number;
    stats:IStatSet;

    constructor(creatureBag:ICreatureBag){
        this.id = creatureBag.id;
        this.title = creatureBag.title;
        this.description = creatureBag.description;
        this.attributes = creatureBag.attributes;
        this.equipment = creatureBag.equipment;

        this.updateStats();

        this.hpCurrent = this.stats.HPTotal;
    }

    updateStats(){
        const stats:IStatSet = {
            Strength:this.attributes.Strength,
            Agility:this.attributes.Agility,
            Vitality:this.attributes.Vitality,
            Spirit:this.attributes.Spirit,
            Luck:this.attributes.Luck,
            Resistances:{
                Physical:0,
                Fire:Math.floor(this.attributes.Agility/3)/100,
                Cold:Math.floor(this.attributes.Strength/3)/100,
                Thunder:Math.floor(this.attributes.Luck/3)/100,
                Chaos:0,
            },
            HPTotal:this.attributes.Vitality*10,
        };

        if(this.equipment.armor) this.equipment.armor.onAddBonuses(stats);
        if(this.equipment.hat) this.equipment.hat.onAddBonuses(stats);
        if(this.equipment.ring) this.equipment.ring.onAddBonuses(stats);
        if(this.equipment.earring) this.equipment.earring.onAddBonuses(stats);
        if(this.equipment.amulet) this.equipment.amulet.onAddBonuses(stats);

        this.stats = stats;
    }

    equipItem(item:ItemEquippable,slot:EquipmentSlot):ItemEquippable{
        const unequippedItem = 

        this.updateStats();

        return null;
    }

    unEquipItem(slot:EquipmentSlot):ItemEquippable{
        //const removedItem = 

        this.updateStats();

        return null;
    }
}
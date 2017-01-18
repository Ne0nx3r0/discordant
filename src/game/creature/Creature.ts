import CreatureType from './CreatureType';
import DamageSet from '../damage/IDamageSet';
import Weapon from '../item/weapon/Weapon';
import AttributeSet from './AttributeSet';
import CreatureEquipment from './CreatureEquipment';
import IStatSet from './IStatSet';
import ItemEquippable from '../item/ItemEquippable';

interface ICreatureBag{
    id:number;
    title:string;
    description:string;
    attributes:AttributeSet;
    equipment: CreatureEquipment;
}

export default class Creature{
    id:number;
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
            Endurance:this.attributes.Endurance,
            Spirit:this.attributes.Spirit,
            Luck:this.attributes.Luck,
            ResistancePhysical:0,
            ResistanceFire:0,
            ResistanceCold:0,
            ResistanceThunder:0,
            ResistanceChaos:0,
            HPTotal:this.attributes.Vitality*10,
        };

        if(this.equipment.armor) this.equipment.armor.onAddBonuses(stats);
        if(this.equipment.hat) this.equipment.hat.onAddBonuses(stats);
        if(this.equipment.ringLeft) this.equipment.ringLeft.onAddBonuses(stats);
        if(this.equipment.ringRight) this.equipment.ringRight.onAddBonuses(stats);
        if(this.equipment.amulet) this.equipment.amulet.onAddBonuses(stats);

        this.stats = stats;
    }

    equipItem(item:ItemEquippable,slot:ItemEquipSlot){


        this.updateStats();
    }

    unEquipItem(slot:ItemEquipSlot){


        this.updateStats();
    }
}
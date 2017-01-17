import CreatureType from './CreatureType';
import DamageSet from './damage/DamageSet';
import Weapon from '../item/weapon/Weapon';
import AttributeSet from './AttributeSet';
import CreatureEquipment from './CreatureEquipment';

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

    constructor(creatureBag:ICreatureBag){
        this.id = creatureBag.id;
        this.title = creatureBag.title;
        this.description = creatureBag.description;
        this.attributes = creatureBag.attributes;
        this.equipment = creatureBag.equipment;
    }



    get totalHP():number{
        return this.getStat('vitality') * 10;
    }

    get resistances():DamageSet{
        //Players involve stats but creatures only use their skin (armor)

        const resistances = new DamageSet();

        this.equipment.armor.addResistance(this,resistances);
        this.equipment.amulet.addResistance(this,resistances);
        this.equipment.ringLeft.addResistance(this,resistances);
        this.equipment.ringRight.addResistance(this,resistances);
        this.equipment.hat.addResistance(this,resistances);

        return resistances;
    }

    getStat(name:string):number{
        const attribute = this.attributes[name];

        if(attribute){
            return attribute + this.class.attributes[name];
        }

        return -1;
    }
}
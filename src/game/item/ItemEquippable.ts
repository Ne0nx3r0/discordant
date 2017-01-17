import ItemBase from './ItemBase';
import {EquipmentSlot} from '../creature/CreatureEquipment';
import DamageSet from '../damage/DamageSet';
import Creature from '../creature/Creature';

interface ResistanceFunc{
    (creature:Creature,resistances:DamageSet):DamageSet;
}
we may need a seperate clothing and weapon class to add resistance and weapon Functions
So we'll add a clothing class and move the resistancfunc to it then use the existing weapon class
export default class ItemEquippable extends ItemBase{
    slot:EquipmentSlot;
    resistanceFunc:ResistanceFunc;

    constructor(id:number,title:string,description:string,slot:EquipmentSlot,resistanceFunc:ResistanceFunc){
        super(id,title,description);

        this.slot = slot;
        this.resistanceFunc = resistanceFunc;
    }

    addResistance(wearer:Creature,resistanceSet:DamageSet){
        return this.resistanceFunc(wearer,resistanceSet);
    }
}
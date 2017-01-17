import ItemBase from './ItemBase';
import {EquipmentSlot} from '../creature/CreatureEquipment';

export default class ItemEquippable extends ItemBase{
    slot:EquipmentSlot;

    constructor(id:number,title:string,description:string,slot:EquipmentSlot){
        super(id,title,description);

        this.slot = slot;
    }
}
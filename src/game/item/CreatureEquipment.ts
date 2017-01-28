import ItemEquippable from './ItemEquippable';
import Weapon from './Weapon';

export interface EquipmentBag{
    amulet?: ItemEquippable;//element resistance, item find, critical hits
    armor?: ItemEquippable;//physical resistance
    earring?: ItemEquippable;//element resistance, item find, critical hits
    hat?: ItemEquippable;// ?
    offhandweapon?: Weapon;
    primaryweapon?: Weapon;
    ring?: ItemEquippable;//element resistance, item find, critical hits
}

export type EquipmentSlot = 
    'amulet' |
    'armor' |
    'earring' |
    'hat' |
    'offhandweapon' |//note these are all lower case so you have the option to use toLowerCase
    'primaryweapon' |//they should be upper, but I hate looking at THINGSINFUCKINGUPPERCASE
    'ring'
;

export default class CreatureEquipment{
    _items:EquipmentBag;

    constructor(equipmentBag:EquipmentBag){
        this._items = equipmentBag;
    }

    //Returns the item that was in that slot, or undefined
    equip(item:ItemEquippable,slot:EquipmentSlot):ItemEquippable{
        const removedItem = this._items[slot];

        this._items[slot] = item;

        if(removedItem){//Really not sure if this conditional should be here or not
            return removedItem;
        }
    }

    //Returns the item that was in that slot, or undefined
    unequip(slot:EquipmentSlot){
        const removedItem = this._items[slot];

        delete this._items[slot];

        return removedItem;
    }

    forEach(callback:Function){
        Object.keys(this._items).forEach((slot:EquipmentSlot)=>{
            callback(this._items[slot],slot);
        });
    }

    toDatabase():EquipmentBag{
        const toDb = {};

        Object.keys(this._items).forEach((slot:EquipmentSlot)=>{
            toDb[slot] = this._items[slot];
        });

        return toDb;
    }

    get all():EquipmentBag{
        return this._items;
    }

    get hat():ItemEquippable{
        return this._items.hat;
    }

    get armor():ItemEquippable{
        return this._items.hat;
    }

    get amulet():ItemEquippable{
        return this._items.hat;
    }

    get ring():ItemEquippable{
        return this._items.hat;
    }

    get earring():ItemEquippable{
        return this._items.hat;
    }

    get primaryweapon():Weapon{
        return this._items.primaryweapon;
    }

    get offhandweapon():Weapon{
        return this._items.offhandweapon;
    }
}
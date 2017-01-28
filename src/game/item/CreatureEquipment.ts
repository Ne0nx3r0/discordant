import ItemEquippable from './ItemEquippable';
import Weapon from './Weapon';

export interface EquipmentBag{
    hat?: ItemEquippable;// ?
    armor?: ItemEquippable;//physical resistance
    amulet?: ItemEquippable;//element resistance, item find, critical hits
    earring?: ItemEquippable;//element resistance, item find, critical hits
    ring?: ItemEquippable;//element resistance, item find, critical hits
    primaryWeapon?: Weapon;
    offhandWeapon?: Weapon;
}

export enum EquipmentSlot{
    Hat,
    Armor,
    Amulet,
    Ring,
    Earring,
    Weapon,
    Offhand,
}

export enum EquipmentSlotType{
    Hat,
    Armor,
    Amulet,
    Ring,
    Earring,
    Weapon,//includes Offhand
}

export default class CreatureEquipment{
    _items:EquipmentBag;

    constructor(equipmentBag:EquipmentBag){
        this._items = equipmentBag;
    }

    get All():EquipmentBag{
        return this._items;
    }

    get Hat():ItemEquippable{
        return this._items.hat;
    }

    get Armor():ItemEquippable{
        return this._items.hat;
    }

    get Amulet():ItemEquippable{
        return this._items.hat;
    }

    get Ring():ItemEquippable{
        return this._items.hat;
    }

    get Earring():ItemEquippable{
        return this._items.hat;
    }

    get PrimaryWeapon():Weapon{
        return this._items.primaryWeapon;
    }

    get OffhandWeapon():Weapon{
        return this._items.offhandWeapon;
    }
}
import ItemEquippable from './ItemEquippable';
import Weapon from './weapon/Weapon';

interface EquipmentBag{
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
    hat: ItemEquippable;
    armor: ItemEquippable;
    amulet: ItemEquippable;
    ring: ItemEquippable;
    earring: ItemEquippable;
    primaryWeapon: Weapon;
    offhandWeapon: Weapon;

    constructor(equipmentBag:EquipmentBag){
        this.hat = equipmentBag.hat;
        this.armor = equipmentBag.armor;
        this.amulet = equipmentBag.amulet;
        this.ring = equipmentBag.ring;
        this.earring = equipmentBag.earring;
        this.primaryWeapon = equipmentBag.primaryWeapon;
        this.offhandWeapon = equipmentBag.offhandWeapon;
    }
}
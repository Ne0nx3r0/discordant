import ItemEquippable from './ItemEquippable';
import Weapon from './weapon/Weapon';

interface EquipmentBag{
    hat?: ItemEquippable;
    armor?: ItemEquippable;
    amulet?: ItemEquippable;
    ringLeft?: ItemEquippable;
    ringRight?: ItemEquippable;
    weaponPrimary?: Weapon;
    weaponOffhand?: Weapon;
}

export enum EquipmentSlotType{
    Hat,
    Armor,
    Ring,
    Amulet,
    Weapon,
}

export enum ItemEquipSlot{
    Hat,
    Armor,
    Amulet,
    RingLeft,
    RingRight,
    WeaponPrimary,
    WeaponOffhand,
};

export default class CreatureEquipment{
    hat: ItemEquippable;
    armor: ItemEquippable;
    amulet: ItemEquippable;
    ringLeft: ItemEquippable;
    ringRight: ItemEquippable;
    weaponPrimary: Weapon;
    weaponOffhand: Weapon;

    constructor(equipmentBag:EquipmentBag){
        this.hat = equipmentBag.hat;
        this.armor = equipmentBag.armor;
        this.amulet = equipmentBag.amulet;
        this.ringLeft = equipmentBag.ringLeft;
        this.ringRight = equipmentBag.ringRight;
        this.weaponPrimary = equipmentBag.weaponPrimary;
        this.weaponOffhand = equipmentBag.weaponOffhand;
    }
}
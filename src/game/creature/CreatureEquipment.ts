import ItemEquippable from '../item/ItemEquippable';
import Weapon from '../item/weapon/Weapon';

interface EquipmentBag{
    hat?: ItemEquippable;
    armor?: ItemEquippable;
    amulet?: ItemEquippable;
    ringLeft?: ItemEquippable;
    ringRight?: ItemEquippable;
    weaponPrimary?: Weapon;
    weaponOffhand?: Weapon;
}

export type EquipmentSlot = 'hat' | 'armor' | 'amulet' | 'ring' | 'weapon';

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
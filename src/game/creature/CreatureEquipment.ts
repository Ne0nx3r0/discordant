import ItemBase from '../item/ItemBase';
import Weapon from '../item/weapon/Weapon';

interface EquipmentBag{
    hat?: ItemBase;
    armor?: ItemBase;
    amulet?: ItemBase;
    ringLeft?: ItemBase;
    ringRight?: ItemBase;
    weaponPrimary?: Weapon;
    weaponOffhand?: Weapon;
}

export type EquipmentSlot = 'hat' | 'armor' | 'amulet' | 'ring' | 'weapon';

export default class CreatureEquipment{
    hat: ItemBase;
    armor: ItemBase;
    amulet: ItemBase;
    ringLeft: ItemBase;
    ringRight: ItemBase;
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
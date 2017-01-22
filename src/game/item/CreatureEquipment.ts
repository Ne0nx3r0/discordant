import ItemEquippable from './ItemEquippable';
import Weapon from './weapon/Weapon';

interface EquipmentBag{
    hat?: ItemEquippable;
    armor?: ItemEquippable;
    amulet?: ItemEquippable;
    earring?: ItemEquippable;
    ring?: ItemEquippable;
    primaryWeapon?: Weapon;
    offhandWeapon?: Weapon;
}

export enum EquipmentSlot{
    Hat,
    Armor,
    Amulet,
    Ring,
    Earing,
    Weapon,
    Offhand,
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
import CreatureType from './CreatureType';
import DamageSet from './damage/DamageSet';

export default interface ICreature {
    id:number;
    title:string;
    description:string;
    type:CreatureType;
    totalHP:number;
    currentHP:number;
    primaryWeapon:Weapon;
    offhandWeapon:Weapon;

    getResistances(): DamageSet;
}
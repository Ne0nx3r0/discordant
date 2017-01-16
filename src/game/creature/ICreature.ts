import CreatureType from './CreatureType';
import DamageSet from './damage/DamageSet';
import Weapon from './weapon/Weapon';

interface ICreature{
    id:number;
    title:string;
    description:string;
    type:CreatureType;
    totalHP:number;
    currentHP:number;
    primaryWeapon:Weapon;
    offhandWeapon:Weapon;
    resistances: DamageSet;

    getStat(stat:string):number;
}

export default ICreature;
import WeaponAttack from './WeaponAttack';
import Creature from '../../creature/Creature';
import ItemEquippable from '../ItemEquippable';

interface useRequirements{
    Strength?:number,
    Vitality?:number,
    Endurance?:number,
    Spirit?:number,
    Luck?:number,
    Class?:number,
}

export default class Weapon extends ItemEquippable{
    attacks:Array<WeaponAttack>;
    useRequirements:useRequirements;

    constructor(id:number,title:string,description:string,useRequirements:useRequirements,attacks:Array<WeaponAttack>){
        super(id,title,description,'weapon');

        this.attacks = attacks;
        this.useRequirements = useRequirements || {};
    }
}
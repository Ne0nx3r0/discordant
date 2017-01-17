import Attack from './Attack';
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
    attacks:Array<Attack>;
    useRequirements:useRequirements;

    constructor(id:number,title:string,description:string,useRequirements:useRequirements,attacks:Array<Attack>){
        super(id,title,description,'weapon');

        this.attacks = attacks;
        this.useRequirements = useRequirements || {};
    }
}
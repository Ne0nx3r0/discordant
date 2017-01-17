import DamageSet from '../damage/DamageSet';

export default class CreatureType{
    id:number;
    title:string;
    resistances:DamageSet;

    constructor(id:number,title:string,resistances:DamageSet){
        this.id = id;
        this.title = title;
        this.resistances = resistances;
    }
}
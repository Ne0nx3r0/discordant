import Attributes from './Attributes';

export default class AttributeSet{
    Strength:number;
    Agility:number;
    Vitality:number;
    Endurance:number;
    Spirit:number;
    Luck:number;

    constructor(str:number,agl:number,vit:number,end:number,spr:number,lck:number){
        this.Strength = str;//requierd to use heavy weapons, 
        this.Agility = agl;//required to use light weapons, increases dodge
        this.Vitality = vit;// increases hp
        this.Endurance = end;// increases fire/cold/thunder resistance
        this.Spirit = spr;// required to use legends
        this.Luck = lck; // better item finds, chance for criticals, increases thunder resistance
    }
}
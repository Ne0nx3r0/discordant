export default class AttributeSet{
    Strength:number;
    Vitality:number;
    Endurance:number;
    Spirit:number;
    Luck:number;

    constructor(str:number,vit:number,end:number,kno:number,spr:number,lck:number){
        this.Strength = str;// increases physical attack, carry weight(?)
        this.Vitality = vit;// increases hp
        this.Endurance = end;// increases fire/cold/thunder resistance
        this.Spirit = spr;// required to use legends
        this.Luck = lck; // better item finds, chance for criticals, increases thunder resistance
    }
}
export default class AttributeSet{
    strength:number;
    vitality:number;
    endurance:number;
    spirit:number;
    luck:number;

    constructor(str:number,vit:number,end:number,kno:number,spr:number,lck:number){
        this.strength = str;// increases physical attack, carry weight(?)
        this.vitality = vit;// increases hp
        this.endurance = end;// increases fire/cold/thunder resistance
        this.spirit = spr;// required to use legends
        this.luck = lck; // better item finds, chance for criticals, increases thunder resistance
    }
}
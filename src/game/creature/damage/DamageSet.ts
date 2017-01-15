import DamageType from './DamageType';

export default class DamageSet{
    PHYSICAL:number;
    FIRE:number;
    COLD:number;
    THUNDER:number;
    CHAOS:number;

    constructor(damages?:any){
        this.PHYSICAL = damages.PHYSICAL || 0;
        this.FIRE = damages.FIRE || 0;
        this.COLD = damages.COLD || 0;
        this.THUNDER = damages.THUNDER || 0;
        this.CHAOS = damages.CHAOS || 0;
    }
}
import DamageType from './DamageType';

interface IDamagesObj{
    Physical?:number;
    Fire?:number;
    Cold?:number;
    Thunder?:number;
    Chaos?:number;
}

export default class DamageSet{
    Physical:number;
    Fire:number;
    Cold:number;
    Thunder:number;
    Chaos:number;

    constructor(damages?:IDamagesObj){
        this.Physical = damages.Physical || 0;
        this.Fire = damages.Fire || 0;
        this.Cold = damages.Cold || 0;
        this.Thunder = damages.Thunder || 0;
        this.Chaos = damages.Chaos || 0;
    }
}
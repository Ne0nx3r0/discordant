import Creature from '../creature/Creature';
import IDamageSet from '../damage/IDamageSet';

interface BattleEmbedFunc{
    (msg:string,color:number):void;
}

export interface EffectEventBag{
    target:Creature
    sendBattleEmbed:BattleEmbedFunc;
}

interface RoundEffectFunc{
    (bag:EffectEventBag):void;
}

interface RoundEffectAttackFunc{
    (bag:EffectEventBag,damages:IDamageSet):boolean;
}

interface BattleTemporaryEffectBag{
    onAdded?:RoundEffectFunc;
    onRoundStart?:RoundEffectFunc;
    onAttack?:RoundEffectAttackFunc;
    onAttacked?:RoundEffectAttackFunc;
    onRoundEnd?:RoundEffectFunc;
    onRemoved?:RoundEffectFunc;
}

export default class BattleTemporaryEffect{
    onAdded?:RoundEffectFunc;
    onRoundStart?:RoundEffectFunc;
    onAttack?:RoundEffectAttackFunc;
    onAttacked?:RoundEffectAttackFunc;
    onRoundEnd?:RoundEffectFunc;
    onRemoved?:RoundEffectFunc;

    constructor(bag:BattleTemporaryEffectBag){
        this.onAdded = bag.onAdded;
        this.onRoundStart = bag.onRoundStart;
        this.onAttack = bag.onAttack;
        this.onAttacked = bag.onAttacked;
        this.onRoundEnd = bag.onRoundEnd;
        this.onRemoved = bag.onRemoved;
    }
}

/*
Poison
Recovery
Stun
Dodge*/
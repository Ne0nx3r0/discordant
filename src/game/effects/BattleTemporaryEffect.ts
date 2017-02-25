import Creature from '../creature/Creature';
import IDamageSet from '../damage/IDamageSet';
import EffectId from './EffectId';

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

export type EffectEventHandler = 'onAdded' | 'onRoundBegin' | 'onAttack' | 'onAttacked' | 'onRoundEnd' | 'onRemoved';

interface BattleTemporaryEffectBag{
    id:EffectId;
    title:string;
    onAdded?:RoundEffectFunc;
    onRoundBegin?:RoundEffectFunc;
    onAttack?:RoundEffectAttackFunc;
    onAttacked?:RoundEffectAttackFunc;
    onRoundEnd?:RoundEffectFunc;
    onRemoved?:RoundEffectFunc;
}

export default class BattleTemporaryEffect{
    id:EffectId;
    title:string;
    onAdded?:RoundEffectFunc;
    onRoundBegin?:RoundEffectFunc;
    onAttack?:RoundEffectAttackFunc;
    onAttacked?:RoundEffectAttackFunc;
    onRoundEnd?:RoundEffectFunc;
    onRemoved?:RoundEffectFunc;

    constructor(bag:BattleTemporaryEffectBag){
        this.title = bag.title;
        this.onAdded = bag.onAdded;
        this.onRoundBegin = bag.onRoundBegin;
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
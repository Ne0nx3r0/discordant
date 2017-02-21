import WeaponAttack from '../item/WeaponAttack';
import WeaponAttackStep from '../item/WeaponAttackStep';
import PlayerCharacter from '../creature/player/PlayerCharacter';
import Creature from '../creature/Creature';
import IDamageSet from '../damage/IDamageSet';

export const ATTACK_TICK_MS = 10000;

export interface IPlayerBattle{
    playerActionAttack(pc:PlayerCharacter,attack:WeaponAttack):Promise<void>;
    playerActionBlock(pc:PlayerCharacter):Promise<void>;
    getPlayerExhaustion(pc:PlayerCharacter):number;
}

export interface IBattlePlayer{
    pc:PlayerCharacter;
    battle:IPlayerBattle;
    blocking:boolean;
    defeated:boolean;
    exhaustion:number;
    queuedAttacks:Array<WeaponAttackStep>;
}

export interface IBattleAttacked{
    creature:Creature;
    damages:IDamageSet;
    blocked:boolean;
    exhaustion:number;
}

export interface IBattleAttackEvent{
    battle:IPlayerBattle;
    message:string;
    attacked: Array<IBattleAttacked>;
}


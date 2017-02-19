import WeaponAttack from '../item/WeaponAttack';
import WeaponAttackStep from '../item/WeaponAttackStep';
import PlayerCharacter from '../creature/player/PlayerCharacter';

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
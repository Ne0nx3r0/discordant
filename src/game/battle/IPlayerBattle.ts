import WeaponAttack from '../item/WeaponAttack';
import PlayerCharacter from '../creature/player/PlayerCharacter';

export interface IPlayerBattle{
    playerActionAttack(pc:PlayerCharacter,attack:WeaponAttack):Promise<void>;
    playerActionBlock(pc:PlayerCharacter):Promise<void>;
    getPlayerExhaustion(pc:PlayerCharacter):number;
}
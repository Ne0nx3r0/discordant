import Command from '../../Command';
import Game from '../../../game/Game';
import CharacterClass from '../../../game/creature/player/CharacterClass';
import CharacterClasses from '../../../game/creature/player/CharacterClasses';
import PlayerCharacter from '../../../game/creature/player/PlayerCharacter';
import CoopMonsterBattle from '../../../game/battle/CoopMonsterBattle';
import { DiscordMessage, CommandBag } from '../../Bot';
import PermissionId from '../../../permissions/PermissionIds';

export default class ChannelId extends Command{
    constructor(){
        super(
            'attack',
            '(in battle) attacks the monster with the default or a specific attack from held primary weapon',
            'attack [attackname]',
            PermissionId.BattleAttack
        );
    }

    run(params:Array<string>,message:DiscordMessage,bag:CommandBag){
        const wantedAttackStr = params.join(' ').toUpperCase();

        if(!bag.pc.inBattle){
            message.channel.sendMessage('You are not currently in a battle, '+bag.pc.title);
        }

        const pcWeaponPrimary = bag.pc.equipment.primaryweapon;
        let attack;
        
        if(params.length == 0){
            attack = pcWeaponPrimary.attacks[0];
        }
        else{
            attack = pcWeaponPrimary.findAttack(wantedAttackStr);
        }

        if(!attack){
            let validAttacks = '';

            pcWeaponPrimary.attacks.forEach((attack)=>{
                validAttacks += ', '+attack.title;
            });

            message.channel.sendMessage(wantedAttackStr+' is not a valid attack, '+bag.pc.title+'. '+pcWeaponPrimary.title+' has: '+validAttacks.substr(2));
        }
        else{
            bag.pc.currentBattleData.battle.playerActionAttack(bag.pc,attack)
            .catch(function(error){message.channel.sendMessage(error);});
        }
    }
}
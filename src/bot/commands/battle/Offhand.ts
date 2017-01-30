import Command from '../../Command';
import Game from '../../../game/Game';
import CharacterClass from '../../../game/creature/player/CharacterClass';
import CharacterClasses from '../../../game/creature/player/CharacterClasses';
import PlayerCharacter from '../../../game/creature/player/PlayerCharacter';
import CoopMonsterBattle from '../../../game/battle/CoopMonsterBattle';
import { DiscordMessage, CommandBag } from '../../Bot';

export default class ChannelId extends Command{
    constructor(){
        super(
            'offhand',
            '(in battle) attacks the monster with the default or a specific attack from held offhand weapon',
            'offhand [attackname]',
            'user.battle.attack'
        );
    }

    run(params:Array<string>,message:DiscordMessage,bag:CommandBag){
        if(!bag.pc.inBattle){
            message.channel.sendMessage('You are not currently in a battle, '+bag.pc.title);
        }

        const wantedAttackStr = params.join(' ').toUpperCase();

        function playerAttack(pc:PlayerCharacter){
            const pcWeaponOffhand = pc.equipment.offhandweapon;
            let attack;
            
            if(params.length == 0){
                attack = pcWeaponOffhand.attacks[0];
            }
            else{
                attack = pcWeaponOffhand.findAttack(wantedAttackStr);
            }

            if(!attack){
                let validAttacks = '';

                pcWeaponOffhand.attacks.forEach((attack)=>{
                    validAttacks += ', '+attack.title;
                });

                message.channel.sendMessage(wantedAttackStr+' is not a valid attack, '+bag.pc.title+'. '+pcWeaponOffhand.title+' has: '+validAttacks.substr(2));
            }
            else{
                pc.currentBattleData.battle.playerActionAttack(pc,attack)
                .catch(function(error){message.channel.sendMessage(error+', '+bag.pc.title);});
            }
        }
    }
}
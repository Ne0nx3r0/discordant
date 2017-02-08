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
            'block',
            '(in battle) blocks for the current round, reducing damage',
            'block',
            PermissionId.BattleBlock
        );
    }

    run(params:Array<string>,message:DiscordMessage,bag:CommandBag){
        if(!bag.pc.isInBattle){
            message.channel.sendMessage('You are not currently in a battle, '+bag.pc.title);

            return;
        }

        if(bag.pc.party.channel.id != message.channel.id){
            message.channel.sendMessage('Your battle is in <#'+bag.pc.party.channel.id+'>, '+bag.pc.title);

            return;
        }

        const wantedAttackStr = params.join(' ').toUpperCase();

        bag.pc.battleData.battle.playerActionBlock(bag.pc)
        .catch(this.handleError(bag));
    }
}
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
            'block',
            '(in battle) blocks for the current round, reducing damage',
            'block',
            'user.battle.block'
        );
    }

    run(params:Array<string>,message:DiscordMessage,bag:CommandBag){
        if(!bag.pc.inBattle){
            message.channel.sendMessage('You are not currently in a battle, '+bag.pc.title);
        }

        const wantedAttackStr = params.join(' ').toUpperCase();

        bag.pc.currentBattleData.battle.playerActionBlock(bag.pc)
        .catch(this.handleError(bag));
    }
}
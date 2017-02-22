import Command from '../../Command';
import Game from '../../../game/Game';
import CharacterClass from '../../../game/creature/player/CharacterClass';
import CharacterClasses from '../../../game/creature/player/CharacterClasses';
import PlayerCharacter from '../../../game/creature/player/PlayerCharacter';
import CoopBattle from '../../../game/battle/CoopBattle';
import { DiscordMessage, CommandBag } from '../../Bot';
import PermissionId from '../../../permissions/PermissionIds';

export default class Block extends Command{
    constructor(){
        super(
            'block',
            '(in battle) blocks for the current round, reducing damage',
            'block',
            PermissionId.BattleBlock
        );

        this.addAlias('b');
    }

    run(params:Array<string>,message:DiscordMessage,bag:CommandBag){
        if(bag.pc.status != 'inBattle'){
            message.channel.sendMessage('You are not currently in a battle, '+bag.pc.title);

            return;
        }

        const battle = bag.pc.battle;

        if(battle.channel.id != message.channel.id){
            message.channel.sendMessage('Your battle is in <#'+battle.channel.id+'>, '+bag.pc.title);

            return;
        }

        const wantedAttackStr = params.join(' ').toUpperCase();

        bag.pc.battle.playerActionBlock(bag.pc)
        .catch(this.handleError(bag));
    }
}
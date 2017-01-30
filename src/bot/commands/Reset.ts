import Command from '../Command';
import Game from '../../game/Game';
import { DiscordMessage, CommandBag } from '../Bot';
import PermissionId from '../../permissions/PermissionIds';

export default class ChannelId extends Command{
    constructor(){
        super(
            'reset',
            'DELETES YOUR CHARACTER DATA DOES NOT WARN YOU',
            'reset',
            PermissionId.Reset
        );
    }

    run(params:Array<string>,message:DiscordMessage,bag:CommandBag){
        bag.game.deletePlayerCharacter(message.author.id)
        .then(function(){
            message.channel.sendMessage('Your character data has been reset');
        })
        .catch(this.handleError(bag));
    }
}
import Command from '../Command';
import Game from '../../game/Game';
import { DiscordMessage, CommandBag } from '../Bot';

export default class ChannelId extends Command{
    constructor(){
        super(
            'reset',
            'DELETES YOUR CHARACTER DATA DOES NOT WARN YOU',
            'reset',
            'player.reset'
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
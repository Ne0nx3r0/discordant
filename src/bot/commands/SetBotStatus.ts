import Command from '../Command';
import Game from '../../game/Game';
import { CommandBag, DiscordMessage } from '../Bot';

export default class ChannelId extends Command{
    constructor(){
        super(
            'setbotstatus',
            'Sets the bots playing message',
            'setbotstatus <status>',
            'admin.status'
        );
    }

     run(params:Array<string>,message:DiscordMessage,bag:CommandBag){
        const status = message.content.substr('setbotstatus '.length);

        bag.setPlayingGame(status);
    }
}
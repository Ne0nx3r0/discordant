import Command from './Command';
import Game from '../../game/Game';
import { BotHandlers } from '../Bot';

export default class ChannelId extends Command{
    constructor(){
        super(
            'setbotstatus',
            'Sets the bots playing message',
            'setbotstatus <status>',
            'admin.status'
        );
    }

    run(params:Array<string>,message:any,game:Game,bot:BotHandlers){
        const status = message.content.substr('setbotstatus '.length);

        bot.setGame(status);
    }
}
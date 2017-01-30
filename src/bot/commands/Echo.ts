import Command from '../Command';
import Game from '../../game/Game';
import { DiscordMessage, CommandBag } from '../Bot';

export default class ChannelId extends Command{
    constructor(){
        super(
            'echo',
            'echos the message sent to it',
            'echo <message>',
            'admin.echo'
        );
    }

    run(params:Array<string>,message:DiscordMessage,bag:CommandBag){
        message.channel.sendMessage(message.content.replace('decho ',''));
    }
}
import Command from '../Command';
import Game from '../../game/Game';
import {DiscordMessage,CommandBag} from '../Bot';

export default class ChannelId extends Command{
    constructor(){
        super(
            'channelid',
            'Returns the channel id of the channel the command is used in',
            'channelid',
            'user.channelid'
        );
    }

    run(params:Array<string>,message:DiscordMessage,bag:CommandBag){
        message.channel.sendMessage('Channel ID: '+message.channel.id);
    }
}
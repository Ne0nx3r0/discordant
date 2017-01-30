import Command from '../Command';
import Game from '../../game/Game';
import {DiscordMessage,CommandBag} from '../Bot';
import PermissionId from '../../permissions/PermissionIds';

export default class ChannelId extends Command{
    constructor(){
        super(
            'channelid',
            'Returns the channel id of the channel the command is used in',
            'channelid',
            PermissionId.ChannelId
        );
    }

    run(params:Array<string>,message:DiscordMessage,bag:CommandBag){
        message.channel.sendMessage('Channel ID: '+message.channel.id);
    }
}
import Command from '../Command';
import Game from '../../game/Game';
import { DiscordMessage, CommandBag } from '../Bot';
import PermissionId from '../../permissions/PermissionIds';

export default class ChannelId extends Command{
    constructor(){
        super(
            'embed',
            'echos the message sent to it as an embed',
            'embed <message>',
            PermissionId.Embed
        );
    }

    run(params:Array<string>,message:DiscordMessage,bag:CommandBag){
        message.channel.sendMessage('',getEmbed(message.content.replace('dembed ','')));
    }
}

function getEmbed(msg:string,color?:number){
    return {
        embed: {
            color: color || 0xFF6347, 
            description: msg,           
        }
    }
}
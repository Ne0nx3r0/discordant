import Command from '../Command';
import Game from '../../game/Game';
import { DiscordMessage, CommandBag } from '../Bot';
import PermissionId from '../../permissions/PermissionIds';

export default class Echo extends Command{
    constructor(){
        super(
            'echo',
            'echos the message sent to it',
            'echo <message>',
            PermissionId.Echo
        );
    }

    run(params:Array<string>,message:DiscordMessage,bag:CommandBag){
        message.channel.sendMessage(params.join(' '));
    }
}
import Command from '../Command';
import Game from '../../game/Game';
import { DiscordMessage, CommandBag } from '../Bot';
import PermissionId from '../../permissions/PermissionIds';

export default class ChannelId extends Command{
    constructor(){
        super(
            'shutdown',
            'Shuts the bot down',
            'shutdown',
            PermissionId.Shutdown
        );
    }

    run(params:Array<string>,message:DiscordMessage,bag:CommandBag){
        message.channel.sendMessage('Shutting down...');

        setTimeout(function(){
            process.exit();
        },100);
    }
}
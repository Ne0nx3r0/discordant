import Command from '../Command';
import Game from '../../game/Game';
import { DiscordMessage, CommandBag } from '../Bot';
import PermissionId from '../../permissions/PermissionIds';

export default class Echo extends Command{
    constructor(){
        super(
            'item',
            'Learn about an item',
            'item [item name]',
            PermissionId.Item
        );
    }

    run(params:Array<string>,message:DiscordMessage,bag:CommandBag){
        message.channel.sendMessage(params.join(' '));
    }
}
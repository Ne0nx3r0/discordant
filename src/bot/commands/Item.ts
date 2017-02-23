import Command from '../Command';
import Game from '../../game/Game';
import { DiscordMessage, CommandBag } from '../Bot';
import PermissionId from '../../permissions/PermissionIds';
import EmbedColors from '../../util/EmbedColors';

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
        if(params.length < 1){
            message.channel.sendMessage(this.getUsage());

            return;
        }

        const itemName = params.join(' ');

        const item = bag.game.items.findByName(itemName);

        if(!item){
            message.channel.sendMessage(itemName+' not found, '+bag.pc.title);

            return;
        }

        bag.respond('',this.getEmbed(`
            ${item.title}

            ${item.description}
        `,EmbedColors.INFO));
    }
}
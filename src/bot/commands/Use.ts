import Command from '../Command';
import Game from '../../game/Game';
import { DiscordMessage, CommandBag } from '../Bot';
import PermissionId from '../../permissions/PermissionIds';
import ParseNumber from '../../util/ParseNumber';
import PlayerCharacter from '../../game/creature/player/PlayerCharacter';

export default class Use extends Command{
    constructor(){
        super(
            'use',
            'Use an item',
            'use <itemname>',
            PermissionId.Use
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

        if(!bag.pc.inventory.hasItem(item,1)){
            message.channel.sendMessage(`You don't have any ${item.title}, ${bag.pc.title}`);

            return;
        }

        //pass to game async function which should throw error if unable to use item
        //if item was used convert to ItemUsable then do the onUse effect for bag.pc
    }
}
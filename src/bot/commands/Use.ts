import Command from '../Command';
import Game from '../../game/Game';
import { DiscordMessage, CommandBag } from '../Bot';
import PermissionId from '../../permissions/PermissionIds';
import ParseNumber from '../../util/ParseNumber';
import PlayerCharacter from '../../game/creature/player/PlayerCharacter';
import ItemUsable from '../../game/item/ItemUsable';

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

        if(!(item instanceof ItemUsable)){
            bag.respond(`${item.title} is not a usable item, ${bag.pc.title}`);

            return;
        }

        const itemUsable = item as ItemUsable;

        (async()=>{
            try{
                itemUsable.canUse(bag.pc);//allowed to throw error

                if(bag.pc.battle){
                    if(bag.pc.battle.getPlayerExhaustion(bag.pc) > 0){
                        throw 'You are exhausted!';
                    }
                }

                await bag.game.takeItem(bag.pc,item,1);//allowed to throw error

                const result = itemUsable.onUse(bag.pc);//allowed to throw error

                bag.respond(result+', '+bag.pc.title);
            }
            catch(ex){
                bag.respond(ex+', '+bag.pc.title);
            }
        })();
    }
}
import Command from '../Command';
import Game from '../../game/Game';
import { DiscordMessage, CommandBag } from '../Bot';
import PermissionId from '../../permissions/PermissionIds';

export default class Inventory extends Command{
    constructor(){
        super(
            'inv',
            'Shows the current player\'s inventory',
            'inv',
            PermissionId.Inventory
        );
    }

    run(params:Array<string>,message:DiscordMessage,bag:CommandBag){
        const playerItems = [];

        bag.pc.inventory.items.forEach((item)=>{
            playerItems.push(item.base.title+' ('+item.amount+')');
        });

        message.channel.sendMessage(bag.pc.title+'\'s Items: \n'+playerItems.join(', '));
    }
}
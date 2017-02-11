import Command from '../Command';
import Game from '../../game/Game';
import { DiscordMessage, CommandBag } from '../Bot';
import PermissionId from '../../permissions/PermissionIds';
import {TagRegex} from '../../util/Regex';
import ParseNumber from '../../util/ParseNumber';

export default class Give extends Command{
    constructor(){
        super(
            'give',
            'Give another player an item',
            'give <@username> <item name> [amount]',
            PermissionId.Give
        );
    }

    run(params:Array<string>,message:DiscordMessage,bag:CommandBag){
        if(params.length < 2){
            message.channel.sendMessage(this.getUsage());

            return;
        }

        const userTag = params[0];

        if(!TagRegex.test(userTag)){
            message.channel.sendMessage(this.getUsage());

            return;
        }

        const usernameTo = TagRegex.exec(userTag)[1];

        const amountWantedStr = params[params.length-1];
        let amountWanted:number = ParseNumber(amountWantedStr);
        let itemWantedStr;

        //assume everything after the first element is the item name
        if(isNaN(amountWanted)){
            amountWanted = 1;
            itemWantedStr = params.slice(1).join(' ');
        }
        else{
            itemWantedStr = params.slice(1,-1).join(' ');
        }

        message.channel.sendMessage(usernameTo+' ' + amountWanted+' ' +itemWantedStr+', '+bag.pc.title);

        const itemWanted = bag.game.items.findByName(itemWantedStr);

        if(!itemWanted){
            message.channel.sendMessage('Unable to find '+itemWantedStr+', '+bag.pc.title);

            return;
        }

        if(!bag.pc.inventory.has(itemWanted.id,amountWanted)){
            message.channel.sendMessage('You have less than '+amountWanted+' '+itemWanted.title+', '+bag.pc.title);

            return;
        }

        message.channel.sendMessage('would do it now');
        //run a game async command to move the item to the new player

        //notify the player
    }
}
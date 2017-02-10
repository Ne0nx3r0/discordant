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
        let itemWanted;

        //assume everything after the first element is the item name
        if(isNaN(amountWanted)){
            amountWanted = 1;
            itemWanted = params.slice(1).join(' ');
        }
        else{
            itemWanted = params.slice(1,-1).join(' ');
        }

        message.channel.sendMessage(usernameTo+' ' + amountWanted+' ' +itemWanted+', '+bag.pc.title);

        //check if the item exists

        //check if the player has the item
        
        //run a game async command to move the item to the new player

        //notify the player
    }
}
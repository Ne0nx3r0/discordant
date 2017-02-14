import Command from '../Command';
import Game from '../../game/Game';
import { DiscordMessage, CommandBag } from '../Bot';
import PermissionId from '../../permissions/PermissionIds';
import {TagRegex} from '../../util/Regex';
import ParseNumber from '../../util/ParseNumber';
import PlayerCharacter from '../../game/creature/player/PlayerCharacter';

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

        const usernameToUID = TagRegex.exec(userTag)[1];

        asyncCommand();

        async function asyncCommand(){
            try{
                const giveItemTo:PlayerCharacter = await bag.game.getPlayerCharacter(usernameToUID);

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

                const itemWanted = bag.game.items.findByName(itemWantedStr);

                if(!itemWanted){
                    message.channel.sendMessage('Unable to find '+itemWantedStr+', '+bag.pc.title);

                    return;
                }

               // await bag.game.transferItem(bag.pc,giveItemTo,itemWanted,amountWanted);
            
                message.channel.sendMessage(`{bag.pc.title} gave {amountWanted} {itemWanted.title} to {giveItemTo.title}`);
            }
            catch(ex){
                message.channel.sendMessage(ex+', '+bag.pc.title);

                return;
            }
        }
    }
}
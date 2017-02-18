import Command from '../Command';
import Game from '../../game/Game';
import { DiscordMessage, CommandBag } from '../Bot';
import PermissionId from '../../permissions/PermissionIds';
import ParseNumber from '../../util/ParseNumber';
import PlayerCharacter from '../../game/creature/player/PlayerCharacter';

export default class Grant extends Command{
    constructor(){
        super(
            'grant',
            'Create an item/xp/wishes for player',
            'grant <@username> <item name|wishes|xp> [amount]',
            PermissionId.Grant
        );
    }

    run(params:Array<string>,message:DiscordMessage,bag:CommandBag){
        if(params.length < 2){
            message.channel.sendMessage(this.getUsage());

            return;
        }

        const userTag = this.getTagID(params[0]);

        if(!userTag){
            message.channel.sendMessage(this.getUsage());

            return;
        }

        (async function(){
            try{
                const giveItemTo:PlayerCharacter = await bag.game.getPlayerCharacter(userTag);

                if(!giveItemTo){
                    message.channel.sendMessage('That player has not registered yet, '+bag.pc.title);

                    return;
                }

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

                await bag.game.grantItem(giveItemTo,itemWanted,amountWanted);
            
                message.channel.sendMessage(`${bag.pc.title} created ${amountWanted} ${itemWanted.title} for ${giveItemTo.title}`);
            }
            catch(ex){
                message.channel.sendMessage(ex+', '+bag.pc.title);

                return;
            }
        })();
    }
}
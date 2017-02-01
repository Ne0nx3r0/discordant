import Command from '../../Command';
import Game from '../../../game/Game';
import { CommandBag, DiscordMessage, DiscordTextChannel } from '../../Bot';
import PermissionId from '../../../permissions/PermissionIds';

export default class PartyNew extends Command{
    constructor(){
        super(
            'dparty new',
            'Creates a new party',
            'dparty new [name]',
            PermissionId.PartyNew
        );
    }

    run(params:Array<string>,message:DiscordMessage,bag:CommandBag){
        if(params.length == 0){
            message.channel.sendMessage('You must specify a name for your party, '+bag.pc.title);
            
            return;
        }

        const errHandler = this.handleError(bag);

        (async function(){
            try{
                const partyName = params.join(' ').replace(/ /g,'-');

                const channel = await bag.bot.createPrivateChannel(message.guild,partyName,bag.pc);

                const party = bag.game.createPlayerParty(partyName,bag.pc,channel);

                message.channel.sendMessage('Your party is ready at <#'+channel.id+'> '+bag.pc.title+'!');
            }
            catch(ex){
                errHandler(ex);
            }
        })();
    }
}
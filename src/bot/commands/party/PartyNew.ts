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
        const errHandler = this.handleError(bag);

        async function _run(){
            try{
                const channel = await bag.bot.createPrivateChannel(message.guild,params.join(' '),bag.pc);

                message.channel.sendMessage('Your party is ready at <#'+channel.id+'> '+bag.pc.title+'!');
            }
            catch(ex){
                errHandler(ex);
            }
        }

        _run();
    }
}
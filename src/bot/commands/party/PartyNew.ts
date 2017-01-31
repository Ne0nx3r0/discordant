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

    run(params:Array<string>,message:DiscordMessage,bag:CommandBag){console.log(params);
        bag.bot.createPrivateChannel(message.guild,params.join(' '),bag.pc)
        .then(channelCreated)
        .catch(this.handleError(bag));

        function channelCreated(channel:DiscordTextChannel){

            message.channel.sendMessage('Your party is ready at <#'+channel.id+'> '+bag.pc.title+'!');
        }
    }
}
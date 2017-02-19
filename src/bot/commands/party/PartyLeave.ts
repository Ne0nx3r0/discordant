import Command from '../../Command';
import Game from '../../../game/Game';
import { CommandBag, DiscordMessage, DiscordTextChannel } from '../../Bot';
import PermissionId from '../../../permissions/PermissionIds';

export default class PartyLeave extends Command{
    constructor(){
        super(
            'dparty leave',
            'leaves the current party',
            'dparty leave',
            PermissionId.PartyNew
        );
    }

    run(params:Array<string>,message:DiscordMessage,bag:CommandBag){
        if(bag.pc.status == 'inParty'){
            message.channel.sendMessage('You are not currently in a party, '+bag.pc.title);

            return;
        }

        const party = bag.pc.party;

        if(party.leader == bag.pc){
            message.channel.sendMessage('Leaders cannot leave a party, you must use `'+bag.bot.commandPrefix+'party disband`, '+bag.pc.title);

            return;
        }

        party.playerActionLeave(bag.pc);

        bag.bot.revokeAccessToPrivateChannel(bag.pc,party.channel);

        message.client.users.get(bag.pc.uid).sendMessage('You have left '+party.title+', '+bag.pc.title);
    }
}
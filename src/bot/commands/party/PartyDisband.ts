import Command from '../../Command';
import Game from '../../../game/Game';
import { CommandBag, DiscordMessage, DiscordTextChannel } from '../../Bot';
import PermissionId from '../../../permissions/PermissionIds';

export default class PartyDisband extends Command{
    constructor(){
        super(
            'dparty disband',
            'disbands the current party',
            'dparty disband',
            PermissionId.PartyNew
        );
    }

    run(params:Array<string>,message:DiscordMessage,bag:CommandBag){
        if(!bag.pc.inParty){
            message.channel.sendMessage('You are not currently in a party, '+bag.pc.title);

            return;
        }

        const party = bag.pc.currentPartyData.party;

        if(party.leader != bag.pc){
            message.channel.sendMessage('Only the party leader can disband the party');

            return;
        }

        party.playerActionDisband();

        const pcUser = message.client.users.get(bag.pc.uid);

        pcUser.sendMessage('Your party has been disbanded');
    }
}
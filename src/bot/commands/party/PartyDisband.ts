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
        if(!bag.pc.isInParty){
            message.channel.sendMessage('You are not currently in a party, '+bag.pc.title);

            return;
        }

        if(bag.pc.partyData.party.isInBattle){
            message.channel.sendMessage('You must finish the current battle, '+bag.pc.title);

            return;
        }

        const party = bag.pc.partyData.party;

        if(party.leader != bag.pc){
            message.channel.sendMessage('Only the party leader can disband the party');

            return;
        }

        const leaderUser = message.client.users.get(party.leader.uid);

        leaderUser.sendMessage('Your party has been disbanded');

        party.members.forEach(function(member){
            const memberUser = message.client.users.get(member.uid);

            memberUser.sendMessage('Your party has been disbanded');
        });
        
        party.playerActionDisband();
    }
}
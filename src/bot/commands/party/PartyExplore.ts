import Command from '../../Command';
import Game from '../../../game/Game';
import { DiscordMessage, CommandBag } from '../../Bot';
import PermissionId from '../../../permissions/PermissionIds';
import {PartyStatus} from '../../../game/party/PlayerParty';
import {WesternGateMap} from '../../../game/map/Maps';

export default class PartyExplore extends Command{
    constructor(){
        super(
            'explore',
            'Leave the safety of the city and explore your surroundings',
            'explore',
            PermissionId.PartyExplore
        );
    }

    run(params:Array<string>,message:DiscordMessage,bag:CommandBag){       
        if(!bag.pc.isPartyLeader){
            message.channel.sendMessage('Only the party leader can direct the party to explore, '+bag.pc.title);

            return;
        }

        const party = bag.pc.party;

        if(party.partyStatus != PartyStatus.InTown){
            message.channel.sendMessage('Your party is already out exploring, '+bag.pc.title);

            return;
        }

        if(party.channel.id != message.channel.id){
            message.channel.sendMessage('Your party is at <#'+party.channel.id+'>, '+bag.pc.title);

            return;
        }

        party.explore(WesternGateMap);
    }
}
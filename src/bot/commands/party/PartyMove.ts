import Command from '../../Command';
import Game from '../../../game/Game';
import { DiscordMessage, CommandBag } from '../../Bot';
import PermissionId from '../../../permissions/PermissionIds';
import {PartyStatus} from '../../../game/party/PlayerParty';
import {PartyMoveDirection} from '../../../game/party/PartyExploringMap';
import {TestMap} from '../../../game/map/Maps';

export default class PartyMove extends Command{
    direction:PartyMoveDirection;

    constructor(direction:PartyMoveDirection){
        super(
            'move',
            'Move the party',
            'move <direction>',
            PermissionId.PartyMove
        );

        this.direction = direction;
    }

    run(params:Array<string>,message:DiscordMessage,bag:CommandBag){
        if(bag.pc.status != 'leadingParty'){
            message.channel.sendMessage('Only the party leader can direct the party to explore, '+bag.pc.title);

            return;
        }

        const party = bag.pc.party;

        if(party.partyStatus != PartyStatus.Exploring){
            message.channel.sendMessage('Your party is not currently exploring, '+bag.pc.title);

            return;
        }

        if(party.channel.id != message.channel.id){
            message.channel.sendMessage('Your party is at <#'+party.channel.id+'>, '+bag.pc.title);

            return;
        }

        party.move(this.direction);
    }
}
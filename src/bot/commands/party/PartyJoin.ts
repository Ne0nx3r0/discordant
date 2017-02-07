import Command from '../../Command';
import Game from '../../../game/Game';
import { CommandBag, DiscordMessage, DiscordTextChannel } from '../../Bot';
import PermissionId from '../../../permissions/PermissionIds';
import PlayerParty from '../../../game/party/PlayerParty';
import {PartyStatus} from '../../../game/party/PlayerParty';

const TAG_REGEX = new RegExp(/<@([0-9]+)>/);

export default class PartyJoin extends Command{
    constructor(){
        super(
            'dparty join',
            '(once invited) joins a party',
            'dparty join',
            PermissionId.PartyJoin
        );
    }

    run(params:Array<string>,message:DiscordMessage,bag:CommandBag){
        if(!bag.pc.isConsideringPartyInvite){
            message.channel.sendMessage('You do not have a pending invite, '+bag.pc.title);

            return;
        }     

        if(!bag.pc.partyData.party.isInTown){
            message.channel.sendMessage('That party has already left town, '+bag.pc.title);

            return;
        }  

        const errHandler = this.handleError(bag);

        (async function(){
            try{
                const party:PlayerParty = bag.pc.partyData.party;

                party.playerActionJoin(bag.pc);

                await bag.bot.grantAccessToPrivateChannel(bag.pc,party.channel);

                message.channel.sendMessage('Your party is waiting for you at <#'+party.channel.id+'>, '+bag.pc.title+'!');
            }
            catch(ex){
                errHandler(ex);
            }
        })();
    }
}
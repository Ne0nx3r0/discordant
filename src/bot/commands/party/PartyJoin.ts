import Command from '../../Command';
import Game from '../../../game/Game';
import { CommandBag, DiscordMessage, DiscordTextChannel } from '../../Bot';
import PermissionId from '../../../permissions/PermissionIds';
import PlayerParty from '../../../game/party/PlayerParty';

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
        if(!bag.pc.hasPendingPartyInvite){
            message.channel.sendMessage('You do not have a pending invite, '+bag.pc.title);

            return;
        }       

        const errHandler = this.handleError(bag);

        (async function(){
            try{
                const party:PlayerParty = bag.pc.party;

                party.playerActionJoin(bag.pc);

                await bag.bot.grantAccessToPrivateChannel(bag.pc,party.channel);

                message.channel.sendMessage('Your party is waiting for you at <#'+party.channel.id+'> !');
            }
            catch(ex){
                errHandler(ex);
            }
        })();
    }
}
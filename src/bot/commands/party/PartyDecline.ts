import Command from '../../Command';
import Game from '../../../game/Game';
import { CommandBag, DiscordMessage, DiscordTextChannel } from '../../Bot';
import PermissionId from '../../../permissions/PermissionIds';

const TAG_REGEX = new RegExp(/<@([0-9]+)>/);

export default class PartyDecline extends Command{
    constructor(){
        super(
            'dparty decline',
            '(After being invited) declines a party invite',
            'dparty decline',
            PermissionId.PartyInvite
        );
    }

    run(params:Array<string>,message:DiscordMessage,bag:CommandBag){
        if(!bag.pc.hasPendingPartyInvite){
            message.channel.sendMessage('You do not have a pending party invitation, '+bag.pc.title);

            return;
        }
        
        bag.pc.pendingPartyInvite = null;

        message.channel.sendMessage('Party invitation declined, '+bag.pc.title);
    }
}
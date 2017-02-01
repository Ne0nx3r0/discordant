import Command from '../../Command';
import Game from '../../../game/Game';
import { CommandBag, DiscordMessage, DiscordTextChannel } from '../../Bot';
import PermissionId from '../../../permissions/PermissionIds';

const TAG_REGEX = new RegExp(/<@([0-9]+)>/);

export default class PartyNew extends Command{
    constructor(){
        super(
            'dparty invite',
            '(As party leader) Invites someone to join your party',
            'dparty \<@user>',
            PermissionId.PartyInvite
        );
    }

    run(params:Array<string>,message:DiscordMessage,bag:CommandBag){
        const userTag = params[0];

        if(!TAG_REGEX.test(userTag)){
            message.channel.sendMessage('You must tag the person you want to invite with @username, '+bag.pc.title);
            
            return;
        }

        const invitedUid = TAG_REGEX.exec(userTag)[1];
        
        const errHandler = this.handleError(bag);

        (async function(){
            try{
                const invitedPC = await bag.game.getPlayerCharacter(invitedUid);

                if(!invitedPC){
                    message.channel.sendMessage('That user has not registered yet, '+bag.pc.title);

                    return;
                }

                if(invitedPC.inParty){
                    message.channel.sendMessage(invitedPC.title+' is already in a party, '+bag.pc.title);

                    return;
                }
                
                if(invitedPC.hasPendingPartyInvite){
                    message.channel.sendMessage(invitedPC.title+' is considering another party invite, '+bag.pc.title);

                    return;
                }

                const party = bag.pc.currentPartyData.party;

                invitedPC.pendingPartyInvite = {
                    party: party,
                    expires: new Date().getTime()+60000
                };

                setTimeout(function() {
                    invitedPC.pendingPartyInvite = null;

                    message.channel.sendMessage('Invitation to '+invitedPC.title+' expired, '+bag.pc.title);
                }, 60000);

                message.channel.sendMessage('<@'+invitedPC.uid+'>, you have been invited to join party '+party.title
                +'\n\nYou can use `daccept` or `ddecline` or let the invite expire in 30 seconds');
            }
            catch(ex){
                errHandler(ex);
            }
        })();
    }
}
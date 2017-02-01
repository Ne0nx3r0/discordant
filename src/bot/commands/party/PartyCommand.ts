import Command from '../../Command';
import Game from '../../../game/Game';
import { CommandBag, DiscordMessage } from '../../Bot';
import PartyNew from './PartyNew';
import PartyInvite from './PartyInvite';
import PartyDisband from './PartyDisband';
import PartyJoin from './PartyJoin';
import PartyLeave from './PartyLeave';
import PartyDecline from './PartyDecline';
import PermissionId from '../../../permissions/PermissionIds';

export default class PartyCommand extends Command{
    subCommands:Map<String,Command>;
    
    constructor(){
        super(
            'dparty',
            'Party management commands',
            'dparty [action]',
            PermissionId.Party
        );

        this.subCommands = new Map();

        this.subCommands.set('new',new PartyNew());
        this.subCommands.set('invite',new PartyInvite());
        this.subCommands.set('join',new PartyJoin());
        this.subCommands.set('leave',new PartyLeave());
        this.subCommands.set('disband',new PartyDisband());
        this.subCommands.set('decline',new PartyDecline());
    }

    run(params:Array<string>,message:DiscordMessage,bag:CommandBag){
        let subCommand = params.length == 0 ? 'help' : params[0];

        if(subCommand == 'rocking'){
            message.channel.sendMessage(':tada: SORRY. FOR. PARTY. ROCKING. :tada:');

            return;
        }

        if(subCommand == 'accept') subCommand = 'join';

        if(!this.subCommands.has(subCommand)){
            message.channel.sendMessage(`\`\`\`diff
+ Party commands +
dparty new [name] - Create a new party
dparty invite \<@username> - Invite a player to join
dparty join - accept a party invite
dparty decline - decline a party invite
dparty leave - Leave your current party
dparty disband - Remove all members and delete the party
\`\`\``);

            return;
        }

        const subParams = [].concat(params).slice(1);

        this.subCommands.get(subCommand).run(subParams,message,bag);
    }
}
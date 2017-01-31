import Command from '../../Command';
import Game from '../../../game/Game';
import { CommandBag, DiscordMessage } from '../../Bot';
import PartyNew from './Partynew';
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
    }

    run(params:Array<string>,message:DiscordMessage,bag:CommandBag){
        const subCommand = params.length == 0 ? 'help' : params[0];

        if(subCommand == 'help' || !this.subCommands.has(subCommand)){
            message.channel.sendMessage(`\`\`\`diff
+ Party commands +
dparty help - This screen
dparty new [name] - Create a new party
dparty disband - Remove all members and delete the party
dparty invite \<@username> - Invite a player to join
\`\`\``);

            return;
        }

        const subParams = [].concat(params).slice(1);

        this.subCommands.get(subCommand).run(subParams,message,bag);
    }
}
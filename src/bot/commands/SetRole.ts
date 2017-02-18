import Command from '../Command';
import Game from '../../game/Game';
import { DiscordMessage, CommandBag } from '../Bot';
import PermissionId from '../../permissions/PermissionIds';

export default class EvalCommand extends Command{
    constructor(){
        super(
            'setrole',
            'Sets the role of a player',
            'setrole \<@playerName> <role>',
            PermissionId.SetRole
        );
    }

    run(params:Array<string>,message:DiscordMessage,bag:CommandBag){
        if(params.length < 2){
            bag.respond(this.getUsage());

            return;
        }
    }
}
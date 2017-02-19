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

        const userTagUID = this.getTagUID(params[0]);

        if(!userTagUID){
            bag.respond('That player is not registered, '+bag.pc.title);

            return;
        }

        const roleStr = params[1];

        if(!bag.permissions.isRole(roleStr)){
            bag.respond(`${roleStr} is not a valid role, ${bag.pc.title}`);

            return;
        }

        (async()=>{
            try{
                const setRolePC = await bag.game.getPlayerCharacter(userTagUID);

                if(!setRolePC){
                    bag.respond(`That user is not registered, ${bag.pc.title}`);

                    return;
                }

                await bag.game.setPlayerRole(setRolePC,roleStr);

                bag.respond(`${setRolePC.title} was granted the \`${roleStr}\` role, ${bag.pc.title}`);
            }
            catch(ex){
                bag.respond(ex+', '+bag.pc.title);
            }
        })();
    }
}
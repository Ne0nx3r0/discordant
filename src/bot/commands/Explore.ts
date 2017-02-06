import Command from '../Command';
import Game from '../../game/Game';
import { DiscordMessage, CommandBag } from '../Bot';
import PermissionId from '../../permissions/PermissionIds';

export default class Explore extends Command{
    constructor(){
        super(
            'explore',
            'Leave the safety of the city and explore your surroundings',
            'explore',
            PermissionId.Explore
        );
    }

    run(params:Array<string>,message:DiscordMessage,bag:CommandBag){
        if(!bag.pc.inParty){
            message.channel.sendMessage('You are not currently in a party, '+bag.pc.title);

            return;
        }
        
        if(!bag.pc.isLeadingParty){
            message.channel.sendMessage('Only the party leader can direct the party to explore, '+bag.pc.title);

            return;
        }

        
    }
}
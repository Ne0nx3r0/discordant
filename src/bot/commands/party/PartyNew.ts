import Command from '../../Command';
import Game from '../../../game/Game';
import { CommandBag, DiscordMessage, DiscordChannel } from '../../Bot';
import PermissionId from '../../../permissions/PermissionIds';

export default class PartyNew extends Command{
    constructor(){
        super(
            'dparty new',
            'Creates a new party',
            'dparty new [name]',
            PermissionId.PartyNew
        );
    }

    run(params:Array<string>,message:DiscordMessage,bag:CommandBag){
        bag.bot.getPrivateChannel(bag.pc)
        .then(gotPrivateChannel)
        .catch(this.handleError(bag));

        function gotPrivateChannel(channel:DiscordChannel){

        }
    }
}
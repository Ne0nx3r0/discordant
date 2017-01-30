import Command from '../../Command';
import Game from '../../../game/Game';
import { CommandBag, DiscordMessage } from '../../Bot';
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
        message.channel.sendMessage('new bra');
    }
}
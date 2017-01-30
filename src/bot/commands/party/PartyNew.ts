import Command from '../../Command';
import Game from '../../../game/Game';
import { CommandBag, DiscordMessage } from '../../Bot';

export default class PartyNew extends Command{
    constructor(){
        super(
            'dpartynew',
            'Creates a new party',
            'dpartynew [name]',
            'player.party.new'
        );
    }

    run(params:Array<string>,message:DiscordMessage,bag:CommandBag){
        //TODO: implement partynew
    }
}
import Command from '../Command';
import Game from '../../../game/Game';
import { BotHandlers } from '../../Bot';

export default class PartyNew extends Command{
    constructor(){
        super(
            'dpartynew',
            'Creates a new party',
            'dpartynew [name]',
            'player.party.new'
        );
    }

    run(params:Array<string>,message:any,game:Game,bot:BotHandlers){
        game.getPlayerCharacter(message.author.id)
        .then()
        .catch(function(error){message.reply(error);});
    }
}
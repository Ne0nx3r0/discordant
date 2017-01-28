import Command from './Command';
import Game from '../../game/Game';

export default class ChannelId extends Command{
    constructor(){
        super(
            'reset',
            'DELETES YOUR CHARACTER DATA DOES NOT WARN YOU',
            'reset',
            'player.reset'
        );
    }

    run(params:Array<string>,message:any,game:Game){
        game.deletePlayerCharacter(message.author.id)
        .then(()=>{message.reply('Your character data has been reset');})
        .catch((err)=>{message.reply(err);});
    }
}
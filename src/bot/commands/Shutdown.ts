import Command from './Command';
import Game from '../../game/Game';

export default class ChannelId extends Command{
    constructor(){
        super(
            'shutdown',
            'Shuts the bot down',
            'shutdown',
            'admin.shutdown'
        );
    }

    run(params:Array<string>,message:any,game:Game){
        message.channel.sendMessage('Shutting down...');

        setTimeout(function(){
            process.exit();
        },100);
    }
}
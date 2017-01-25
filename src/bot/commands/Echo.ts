import Command from './Command';
import Game from '../../game/Game';

export default class ChannelId extends Command{
    constructor(){
        super(
            'echo',
            'echos the message sent to it',
            'echo <message>',
            'admin.echo'
        );
    }

    run(params:Array<string>,message:any,game:Game){
        message.channel.sendMessage(message.content.replace('echo ',''));
    }
}
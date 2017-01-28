import Command from './Command';
import Game from '../../game/Game';

export default class ChannelId extends Command{
    constructor(){
        super(
            'embed',
            'echos the message sent to it as an embed',
            'embed <message>',
            'admin.embed'
        );
    }

    run(params:Array<string>,message:any,game:Game){
        message.channel.sendMessage('',getEmbed(message.content.replace('dembed ','')));
    }
}

function getEmbed(msg:string,color?:number){
    return {
        embed: {
            color: color || 0xFF6347, 
            description: msg,           
        }
    }
}
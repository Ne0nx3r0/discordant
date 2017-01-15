import Command from './Command';
import Game from '../../game/Game';

export default class ChannelId extends Command{
    constructor(){
        super(
            'channelid',
            'Returns the channel id of the channel the command is used in',
            'channelid',
            'user.channelid'
        );
    }

    run(params:Array<string>,message:any,game:Game){
        message.channel.sendMessage('Channel ID: '+message.channel.id);
    }
}
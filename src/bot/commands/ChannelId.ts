import Command from './Command';

export default class ChannelId extends Command{
    constructor(){
        super(
            'channelid',
            'Returns the channel id of the channel the command is used in',
            'channelid',
            'user.channelid'
        );
    }

    run(params,message,game,client){
        message.channel.sendMessage('Channel ID: '+message.channel.id);
    }
}
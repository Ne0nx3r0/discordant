import Command from '../Command';
import Game from '../../game/Game';
import { DiscordMessage, CommandBag } from '../Bot';

export default class ChannelId extends Command{
    constructor(){
        super(
            'help',
            'Shows a list of commands or info on one command',
            'help [command]',
            'player.help'
        );
    }

     run(params:Array<string>,message:DiscordMessage,bag:CommandBag){
        let commandsStr = '';

        bag.commands.forEach(function(command){
            commandsStr += '\n**'+command.name + '** - ' +command.description;
        });

        message.channel.sendMessage('Here are the commands you have access to, '+bag.pc.title+':\n'+commandsStr);
    }
}
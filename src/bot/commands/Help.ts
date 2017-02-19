import Command from '../Command';
import Game from '../../game/Game';
import { DiscordMessage, CommandBag } from '../Bot';
import PermissionId from '../../permissions/PermissionIds';

export default class ChannelId extends Command{
    constructor(){
        super(
            'help',
            'Shows a list of commands or info on one command',
            'help [command]',
            PermissionId.Help
        );

        this.allowAnonymous = true;
        this.addAlias('?');
    }

     run(params:Array<string>,message:DiscordMessage,bag:CommandBag){
        if(params.length > 0){
            const commandStr = params[0];
            const command = bag.bot.commands.get(commandStr.toUpperCase());

            if(!command){
                message.channel.sendMessage('Unknown command: '+commandStr);
            
                return;
            }

            const commandAliasesStr = command.aliases.length==0?'':'(aliases: '+command.aliases.join(', ')+' )';

            message.channel.sendMessage('',getEmbed(`
${bag.bot.commandPrefix.toLowerCase()}**${command.name}** ${commandAliasesStr}

${command.description}

${command.getUsage()}
            `));

            return; 
        }

        const commandsArr = [];

        const pcRole = bag.permissions.getRole(bag.pc?bag.pc.role:'unknown');

        bag.bot.commands.forEach(function(command,commandStr){
            //ignore aliases
            if(command.aliases.indexOf(commandStr.toLowerCase() as string) == -1){
                //Only show commands the player has permission to use
                if(pcRole.has(command.permission) || command.allowAnonymous){
                    commandsArr.push(command.name);
                }
            }
        });

        commandsArr.sort();

        message.channel.sendMessage('',getEmbed('Here are the commands you have access to, '+bag.message.author.username+':\n\n'+commandsArr.join(', ')
        +'\n\n`'+bag.bot.commandPrefix.toLocaleLowerCase()+'help [command]` for more info'));
    }
}

function getEmbed(msg:string,color?:number){
    return {
        embed: {
            color: color || 0x6797E5, 
            description: msg,           
        }
    }
}
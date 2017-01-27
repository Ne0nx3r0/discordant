import Game from '../game/Game';
import Command from './commands/Command';
import * as Commands from "./commands/Commands";

const SpawnArgs = require('spawn-args');
const Discord = require('discord.js');

const COMMAND_PREFIX:string = 'd';

export default class DiscordBot{
    client: any;
    game: Game;
    commands: Map<String,Command>;
    
    constructor(game:Game,authToken:string){
        this.game = game;

        this.client = new Discord.Client();

        this.commands = new Map();

        Object.keys(Commands).forEach((commandName)=>{
            this.commands.set(commandName.toUpperCase(),new Commands[commandName]);
        });

        this.client.on('message',this.handleMessage.bind(this))

        this.client.on('ready',this.handleReady.bind(this));

        this.client.login(authToken);
    }

    handleReady(){
        console.log('Bot: logged in');

        this.client.channels
            .get('263031735770415104')//discordant server general
            .sendMessage('I\'m online!');
    }

    handleMessage(message:any){
        // Ignore self
        if(message.author.id == this.client.id){
            return;
        }

        // Ignore bots
        if(message.author.bot){
            return;
        }

        if(!message.content.startsWith(COMMAND_PREFIX)){
            return;
        }

        const messageRaw = message.content.substr(COMMAND_PREFIX.length);

        const params = SpawnArgs(messageRaw,{ removequotes: 'always' });

        const commandName = params[0].toUpperCase();

        const command:Command = this.commands.get(commandName);

        if(command){
            params.shift();
            
            command.run(params,message,this.game);
        }
        else if(commandName == 'HELP'){
            let commandsStr = '';

            this.commands.forEach(function(command){
                commandsStr += '\n**'+command.name + '** - ' +command.description;
            });

            message.channel.sendMessage('Here are the commands you have access to:\n'+commandsStr);
        }
    }
}
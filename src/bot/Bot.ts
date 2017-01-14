import Game from '../game/Game';
import Command from './commands/Command';

const Discord = require('discord.js');

export default class DiscordBot{
    client: any;
    game: Game;
    commands: Map<String,Command>;
    
    constructor(game:Game,authToken:string){
        this.game = game;

        this.client = new Discord.Client();

        this.addCommand(require('./commands/ChannelId.js'));

        console.log(this.commands);
    }

    addCommand(c:Command){
        this.commands.set(c.name,c);
    }
}
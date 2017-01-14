import Game from '../game/Game';

const Discord = require('discord.js');

export default class DiscordBot{
    client: any;
    constructor(game:Game,authToken:string){
        this.client = new Discord.Client();
    }
}
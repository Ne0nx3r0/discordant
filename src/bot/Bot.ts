/// <reference path='../../node_modules/discord.js/typings/index.d.ts' />

import Game from '../game/Game';
import Command from './Command';
import * as Commands from "./CommandsIndex";
import PlayerCharacter from '../game/creature/player/PlayerCharacter';
import PermissionsService from '../permissions/PermissionsService';
import Logger from '../util/Logger';
import {
    Client as DiscordClient, 
    Message as DiscordMessage, 
    Channel as DiscordChannel, 
    User as DiscordAuthor,
    MessageOptions as DiscordMessageOptions
} from 'discord.js';

export {
    DiscordClient,
    DiscordMessage,
    DiscordChannel,
    DiscordAuthor,
    DiscordMessageOptions,
}

const SpawnArgs = require('spawn-args');
const Discord = require('discord.js');

const COMMAND_PREFIX:string = 'd';

interface setPlayingGameFunc{
    (message:string);
}

interface privateChannelFunc{
    (pc:PlayerCharacter);
}

export interface BotHandlers{
    commands:Map<String,Command>;
    setPlayingGame:setPlayingGameFunc;
    getPrivateChannel:privateChannelFunc;
}

export interface CommandBag{
    game:Game;
    pc?:PlayerCharacter;
    message:DiscordMessage;
    bot:BotHandlers;
}
/*
export interface DiscordAuthor{
    id:string;
    username:string;
    discriminator:number;
}

export interface DiscordChannel{
    id:string;
    name:string;
    sendMessage:Function;
}

export interface DiscordMessage{
    channel:DiscordChannel;
    content:string;
    author:DiscordAuthor;
}*/

export default class DiscordBot{
    client: any;
    game: Game;
    permissions:PermissionsService;
    ownerUIDs:Array<string>;
    mainGuildId:string;
    commands: Map<String,Command>;
    
    constructor(game:Game,permissions:PermissionsService,authToken:string,ownerUIDs:Array<string>,mainGuildId:string){
        this.game = game;
        this.permissions = permissions;
        this.ownerUIDs = ownerUIDs;
        this.mainGuildId = mainGuildId;

        this.client = new Discord.Client() as DiscordClient;

        this.commands = new Map();

        Object.keys(Commands).forEach((commandName)=>{
            this.commands.set(commandName.toUpperCase(),new Commands[commandName]);
        });

        this.setPlayingGame = this.setPlayingGame.bind(this);

        this.client.on('message',this.handleMessage.bind(this))

        this.client.on('ready',this.handleReady.bind(this));

        this.client.login(authToken);
    }

    handleReady(){
        console.log('Bot: logged in');

        this.client.channels
            .get('263031735770415104')//discordant server #testing
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

        //Command not found
        if(!command){
            return;
        }
        
        //trim the command title
        params.shift();

        const bag:CommandBag = {
            bot:{            
               commands: this.commands,
               setPlayingGame: this.setPlayingGame,
               getPrivateChannel: this.getPrivateChannel,
            },
            game: this.game,
            message: message,
        };

        this.game.getPlayerCharacter(message.author.id)
        .then((pc:PlayerCharacter)=>{
            if(!pc && !command.allowAnonymous){
                message.channel.sendMessage('You must first register with `dbegin`, '+message.author.username);

                return;
            }

            bag.pc = pc;

            if(!this.permissions.role(pc.role).has(command.permission)){
                message.channel.sendMessage('You do not have permission to use `'+command.name+'`, '+pc.title);

                return;
            }

            command.run(params,message as DiscordMessage,bag);
        })
        .catch((error)=>{
            let did = '';

            if(error.stack){
                did = Logger.error(error);
            }

            message.channel.sendMessage('An unexpected error occurred, '+message.author.username+' '+did);
        });
    }//handleMessage

    setPlayingGame(message:string){
        return this.client.user.setPlayingGame(message);
    }

    getPrivateChannel(pc:PlayerCharacter){
        return new Promise((resolve,reject)=>{
            if(pc.inParty){
                reject('You are already in a party,'+pc.title);

                return;
            }

            this.client.guilds.get(this.mainGuildId)
            .createChannel()
            .then()
            .fail();

            resolve();
        });
    }
}
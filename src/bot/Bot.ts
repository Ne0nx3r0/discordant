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
   // Channel as DiscordChannel, 
    TextChannel as DiscordTextChannel, 
    User as DiscordAuthor,
    MessageOptions as DiscordMessageOptions,
    PermissionOverwrites as DiscordPermissionOverwrites,
    Guild as DiscordGuild
} from 'discord.js';

export {
    DiscordClient,
    DiscordMessage,
    DiscordTextChannel,
    DiscordAuthor,
    DiscordGuild,
    DiscordMessageOptions,
}

const SpawnArgs = require('spawn-args');
const Discord = require('discord.js');

const COMMAND_PREFIX:string = 'd';

interface setPlayingGameFunc{
    (message:string);
}

interface privateChannelFunc{
    (guild:DiscordGuild,partyName:string,pc:PlayerCharacter):Promise<DiscordTextChannel>;
}

export interface BotHandlers{
    commands:Map<String,Command>;
    setPlayingGame:setPlayingGameFunc;
    createPrivateChannel:privateChannelFunc;
}

export interface CommandBag{
    game:Game;
    pc?:PlayerCharacter;
    message:DiscordMessage;
    bot:BotHandlers;
}

export default class DiscordBot{
    client:DiscordClient;
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

        this.client = new Discord.Client();

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

        //discordant server #testing
        const notificationChannel:DiscordTextChannel = this.client.channels.get('263031735770415104') as DiscordTextChannel;
        
        notificationChannel.sendMessage('I\'m online!');

        let deleteChannelDelay = 0;

        //Clean up any party channels
        this.client.channels.array()
        .forEach(function(channel:DiscordTextChannel,index:number){
            if(channel.name.startsWith('party-')){
                deleteChannelDelay = deleteChannelDelay + 2000;

                setTimeout(function(){
                    try{
                        Logger.info('Deleting channel '+channel.id);
                        
                        channel.delete();
                    }
                    catch(ex){
                        ex.msg = 'Error deleting channel';

                        Logger.error(ex);
                    }
                },deleteChannelDelay);
            }
        });
    }

    handleMessage(message:any){
        // Ignore self
        if(message.author.id == this.client.user.id){
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
               createPrivateChannel: this.createPrivateChannel,
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
        return this.client.user.setGame(message);
    }

    async createPrivateChannel(guild:DiscordGuild,partyName:string,pc:PlayerCharacter):Promise<DiscordTextChannel>{
        if(pc.inParty){
            throw 'You are already in a party';
        }

        try{
            const channelname = 'party-'+partyName
                .replace(/[^A-Za-z0-9-]+/g,'')
                .substr(0,20);

            const overwrites = [
                {id: guild.id, type: 'role', deny: 1024, allow: 0} as DiscordPermissionOverwrites
            ];

            const channel:DiscordTextChannel = await guild.createChannel(channelname,'text',overwrites) as DiscordTextChannel;

            channel.overwritePermissions(pc.uid,{
                SEND_MESSAGES: true
            });

            return channel;
        }
        catch(ex){
            const did = Logger.error(ex);

            throw 'An unexpected error occurred ('+did+')';
        }
    }
}
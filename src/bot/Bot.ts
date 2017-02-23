/// <reference path='../../node_modules/discord.js/typings/index.d.ts' />

import Game from '../game/Game';
import { PvPInvite } from '../game/Game';
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
    PermissionOverwriteOptions as DiscordPermissionOverwriteOptions,
    Guild as DiscordGuild
} from 'discord.js';

export {
    DiscordClient,
    DiscordMessage,
    DiscordTextChannel,
    DiscordAuthor,
    DiscordGuild,
    DiscordMessageOptions,
    DiscordPermissionOverwriteOptions,
}

const SpawnArgs = require('spawn-args');
const Discord = require('discord.js');

interface setPlayingGameFunc{
    (message:string);
}

interface privateChannelFunc{
    (guild:DiscordGuild,partyName:string,pc:PlayerCharacter):Promise<DiscordTextChannel>;
}

interface grantPrivateChannelFunc{
    (pc:PlayerCharacter,channel:DiscordTextChannel):Promise<void>;
}

interface revokePrivateChannelFunc{
    (pc:PlayerCharacter,channel:DiscordTextChannel):Promise<void>;
}

interface pvpChannelFunc{
    (guild:DiscordGuild,invite:PvPInvite):Promise<DiscordTextChannel>;
}

export interface BotHandlers{
    commands:Map<String,Command>;
    setPlayingGame:setPlayingGameFunc;
    createPrivateChannel:privateChannelFunc;
    createPvPChannel:pvpChannelFunc;
    grantAccessToPrivateChannel: grantPrivateChannelFunc;
    revokeAccessToPrivateChannel: revokePrivateChannelFunc;
    commandPrefix: string;
}

interface DiscordSendMessageFunction{
    (content: string, options?: DiscordMessageOptions):Promise<DiscordMessage | DiscordMessage[]>;
}

export interface CommandBag{
    game:Game;
    pc?:PlayerCharacter;
    message:DiscordMessage;
    bot:BotHandlers;
    permissions:PermissionsService;
    respond:DiscordSendMessageFunction;
}

export interface BotBag{
    game: Game;
    permissions: PermissionsService;
    authToken:string,
    ownerUIDs: Array<string>;
    mainGuildId: string;
    commandPrefix: string;
}

const COMMAND_COOLDOWN_MS = 500;

export default class DiscordBot{
    client:DiscordClient;
    game: Game;
    permissions:PermissionsService;
    ownerUIDs:Array<string>;
    mainGuildId:string;
    commands: Map<String,Command>;
    commandPrefix: string;
    _botHandlers:BotHandlers;
    
    constructor(bag:BotBag){
        this.game = bag.game;
        this.permissions = bag.permissions;
        this.ownerUIDs = bag.ownerUIDs;
        this.mainGuildId = bag.mainGuildId;
        this.commandPrefix = bag.commandPrefix.toUpperCase();

        this.client = new Discord.Client();

        this.commands = new Map();

        Object.keys(Commands).forEach((commandName)=>{
            const command:Command = new Commands[commandName];

            this.commands.set(command.name.toUpperCase(),command);

            command.aliases.forEach((aliasStr)=>{
                this.commands.set(aliasStr.toUpperCase(),command);
            });
        });

        this.setPlayingGame = this.setPlayingGame.bind(this);

        this.client.on('message',this.handleMessage.bind(this))

        this.client.on('ready',this.handleReady.bind(this));

        this.client.login(bag.authToken);
    }

    handleReady(){
        console.log('Bot: logged in');

        //discordant server #testing
        const notificationChannel:DiscordTextChannel = this.client.channels.get('263031735770415104') as DiscordTextChannel;
        
        notificationChannel.sendMessage('I\'m online!');

        let deleteChannelDelay = 0;

        this._botHandlers = {            
            commands: this.commands,
            setPlayingGame: this.setPlayingGame.bind(this),
            createPrivateChannel: this.createPrivateChannel.bind(this),
            createPvPChannel: this.createPvPChannel.bind(this),
            grantAccessToPrivateChannel: this.grantAccessToPrivateChannel.bind(this),
            revokeAccessToPrivateChannel: this.revokeAccessToPrivateChannel.bind(this),
            commandPrefix: this.commandPrefix.toLowerCase()
        }

        try{
            //Clean up any party channels
            this.client.channels.array()
            .forEach(function(channel:DiscordTextChannel,index:number){
                if(channel.name && (channel.name.startsWith('pvp-') || channel.name.startsWith('party-'))){
                    deleteChannelDelay = deleteChannelDelay + 2000;

                    setTimeout(function(){
                        try{
                            Logger.info('Deleting channel '+channel.name);
                            
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
        catch(ex){
            Logger.error(ex);
        }
    }

    handleMessage(message:any){
        try{
            // Ignore self
            if(message.author.id == this.client.user.id){
                return;
            }

            // Ignore bots
            if(message.author.bot){
                return;
            }

            if(message.content.substr(0,this.commandPrefix.length).toUpperCase() != this.commandPrefix){
                return;
            }

            const messageRaw = message.content.substr(this.commandPrefix.length);

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
                bot: this._botHandlers,
                game: this.game,
                message: message,
                permissions: this.permissions,
                respond: message.channel.sendMessage.bind(message.channel),
            };

            this.game.getPlayerCharacter(message.author.id)
            .then((pc:PlayerCharacter)=>{
                if(!pc){
                    if(command.allowAnonymous){
                        command.run(params,message as DiscordMessage,bag);
                    }
                    else{
                        message.channel.sendMessage('You must first register with `'+this.commandPrefix.toLocaleLowerCase()+'begin`, '+message.author.username);
                    }

                    return;
                }

                bag.pc = pc;

                if(!pc.role.has(command.permission)
                && this.ownerUIDs.indexOf(pc.uid) == -1){//let owners use any command
                    message.channel.sendMessage('You do not have permission to use `'+command.name+'`, '+pc.title);

                    return;
                }

                if(pc.lastCommand+COMMAND_COOLDOWN_MS<Date.now()){
                    message.channel.sendMessage('You are sending commands too fast, '+pc.title);

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
        }
        catch(ex){
            const did = Logger.error(ex);

            message.channel.sendMessage('An unexpected error occurred, '+message.author.username+' '+did);
        }
    }//handleMessage

    setPlayingGame(message:string){
        return this.client.user.setGame(message);
    }

    async createPrivateChannel(guild:DiscordGuild,partyName:string,pc:PlayerCharacter):Promise<DiscordTextChannel>{
        try{
            const channelname = 'party-'+partyName
                .replace(/[^A-Za-z0-9-]+/g,'')
                .substr(0,20);

            const overwrites = [
                {id: guild.id, type: 'role', deny: 1024, allow: 0} as DiscordPermissionOverwrites
            ];

            const channel:DiscordTextChannel = await guild.createChannel(channelname,'text',overwrites) as DiscordTextChannel;

            channel.overwritePermissions(pc.uid,{
                READ_MESSAGES: true,
                SEND_MESSAGES: true
            });

            return channel;
        }
        catch(ex){
            const did = Logger.error(ex);

            throw 'An unexpected error occurred ('+did+')';
        }
    }
    
    async createPvPChannel(guild:DiscordGuild,invite:PvPInvite):Promise<DiscordTextChannel>{
        try{
            const channelname = ('pvp-'+invite.sender.title.substr(0,invite.sender.title.length/2)+invite.receiver.title.substr(invite.receiver.title.length/2))
                .replace(/[^A-Za-z0-9-]+/g,'')
                .substr(0,20);

            const overwrites = [     
                {
                    id: guild.id, 
                    type: 'role', 
                    deny: 0x00000800/*send_msg*/ + 0x00001000/*send_tts*/, 
                    allow: 0x00000400/*read_msgs*/ + 0x00000040/*reactions*/
                } as DiscordPermissionOverwrites
            ];

            const channel:DiscordTextChannel = await guild.createChannel(channelname,'text',overwrites) as DiscordTextChannel;

            await channel.overwritePermissions(invite.sender.uid,{
                SEND_MESSAGES: true
            });

            await channel.overwritePermissions(invite.receiver.uid,{
                SEND_MESSAGES: true
            });

            return channel;
        }
        catch(ex){
            const did = Logger.error(ex);

            throw 'An unexpected error occurred ('+did+')';
        }
    }

    async grantAccessToPrivateChannel(pc:PlayerCharacter,channel:DiscordTextChannel){
        const overwrites = {
            SEND_MESSAGES: true,
            READ_MESSAGES: true,
            ADD_REACTIONS: true,
        } as DiscordPermissionOverwriteOptions;

        await channel.overwritePermissions(pc.uid,overwrites);
    }

    async revokeAccessToPrivateChannel(pc:PlayerCharacter,channel:DiscordTextChannel){
        const overwrites = {
            SEND_MESSAGES: false,
            READ_MESSAGES: false,
            ADD_REACTIONS: false,
        } as DiscordPermissionOverwriteOptions;

        await channel.overwritePermissions(pc.uid,overwrites);
    }
}
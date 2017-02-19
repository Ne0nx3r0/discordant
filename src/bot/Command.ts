import Game from '../game/Game';
import Bot from './Bot';
import { CommandBag } from './Bot';
import ChannelId from './commands/battle/Block';
import PermissionId from '../permissions/PermissionIds';

const TagRegex = new RegExp(/<@([0-9]+)>/);

export default class Command{
    name:String;
    description:String;
    usage:String;
    permission:PermissionId;
    allowAnonymous:boolean;//set true to allow unregistered players to use the command
    aliases:Array<string>;

    constructor(name:string,description:string,usage:string,permission:PermissionId){
        this.name = name;
        this.description = description;
        this.usage = usage;
        this.permission = permission;
        this.allowAnonymous = false;
        this.aliases = [];
    }

    addAlias(alias:string){
        this.aliases.push(alias);
    }
    
    run(params:Array<string>,message:any,bag:CommandBag){
        throw 'Run method not implemented for command '+this.name;        
    }

    getUsage(){
        return 'Usage: '+ this.usage;
    }

    handleError(bag:CommandBag){
        return function(error:string){
            bag.message.channel.sendMessage(error+', '+bag.pc.title);
        }
    }

    getEmbed(msg:string,color?:number){
        return {
            embed: {
                color: color || 0xFF6347, 
                description: msg,           
            }
        }
    }

    getTagUID(userTag:string):string{
        if(!TagRegex.test(userTag)){
            return null;
        }

        return TagRegex.exec(userTag)[1];
    }
}
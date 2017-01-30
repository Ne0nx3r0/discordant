import Game from '../../game/Game';
import Bot from '../Bot';
import {BotHandlers} from '../Bot';

export default class Command{
    name:String;
    description:String;
    usage:String;
    permissionNode:String;

    constructor(name:string,description:string,usage:string,permissionNode:string){
        this.name = name;
        this.description = description;
        this.usage = usage;
        this.permissionNode = permissionNode;
    }
    
    run(params:Array<string>,message:any,game:Game,bot:BotHandlers){
        throw 'Run method not implemented for command '+this.name;        
    }

    getUsage(){
        return 'Usage: '+ this.usage;
    }

    getErrorMsg(errorMsg:string,username:string){
        return '```diff\n- '+username+' -'+errorMsg+'```';
    }

    getEmbed(msg:string,color?:number){
        return {
            embed: {
                color: color || 0xFF6347, 
                description: msg,           
            }
        }
    }
}
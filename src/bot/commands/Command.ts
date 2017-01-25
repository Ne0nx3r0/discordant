import Game from '../../game/Game';

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

    fail(handler:Function){
        return function(error){
            handler(error);
        }
    }

    run(params:Array<string>,message:any,game:Game){
        throw 'Run method not implemented for command '+this.name;        
    }

    getUsage(){
        return 'Usage: '+ this.usage;
    }
}
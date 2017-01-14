export default class Command{
    name:String;
    description:String;
    usage:String;
    permissionNode:String;

    constructor(name,description,usage,permissionNode){
        this.name = name;
        this.description = description;
        this.usage = usage;
        this.permissionNode = permissionNode;
    }

    run(params,message,game,client){
        throw 'Run method not implemented for command '+this.name;        
    }

    getUsage(){
        return 'Usage: '+ this.usage;
    }
}
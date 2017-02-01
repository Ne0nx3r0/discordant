import PlayerCharacter from '../creature/player/PlayerCharacter';
import {DiscordTextChannel} from '../../bot/Bot';

export default class PlayerParty{
    title: string;
    leader:PlayerCharacter;
    members:Map<string,PlayerCharacter>;
    channel:DiscordTextChannel;

    constructor(title:string,leader:PlayerCharacter,channel:DiscordTextChannel){
        this.title = title;
        this.leader = leader;
        this.channel = channel;
        this.members = new Map();

        this.leader.currentPartyData = {
            party: this
        };
    }

    playerActionJoin(pc:PlayerCharacter){
        this.members.set(pc.uid,pc);

        pc.currentPartyData = {
            party: this
        };
    }

    playerActionLeave(pc:PlayerCharacter){
        this.members.delete(pc.uid);

        pc.currentPartyData = null;
    }

    playerActionDisband(){
        this.members.forEach((pc)=>{
            this.playerActionLeave(pc);
        });

        this.playerActionLeave(this.leader);
    }

    //TODO: set up events the same as battle uses
}
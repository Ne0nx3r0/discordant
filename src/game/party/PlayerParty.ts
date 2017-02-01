import PlayerCharacter from '../creature/player/PlayerCharacter';
import {DiscordTextChannel} from '../../bot/Bot';
import EventDispatcher from '../../util/EventDispatcher';
import PartyDisband from '../../bot/commands/party/PartyDisband';

const INVITE_EXPIRES_MS = 60000;

export default class PlayerParty{
    leader:PlayerCharacter;
    title: string;
    members:Map<string,PlayerCharacter>;
    invited:Map<string,PlayerCharacter>;
    channel:DiscordTextChannel;

    _events: EventDispatcher;

    constructor(title:string,leader:PlayerCharacter,channel:DiscordTextChannel){
        this.leader = leader;
        this.title = title;
        this.channel = channel;
        this.members = new Map();
        this.invited = new Map();

        this.leader._currentPartyData = {
            party: this,
        };
        
        this._events = new EventDispatcher();
    }

    get id():string{
        return this.leader.uid;
    }

    playerActionInvite(pc:PlayerCharacter){
        this.invited.set(pc.uid,pc);

        pc._currentPartyData = {
            party:this,
            expires: new Date().getTime()+INVITE_EXPIRES_MS,
        };

        const eventData:PlayerInvitedEvent = {
            party: this,
            pc:pc,
        };

        this.dispatch(PlayerPartyEvent.PlayerInvited,eventData);

        const party = this;

        setTimeout(function(){
            //If this invite is still pending
            if(pc._currentPartyData 
            && pc._currentPartyData.party.id == party.id
            && 'expires' in pc._currentPartyData){
                pc._currentPartyData = null;
            }

            party.invited.delete(pc.uid);
        },INVITE_EXPIRES_MS);
    }

    playerActionDecline(pc:PlayerCharacter){
        this.invited.delete(pc.uid);

        const eventData:PlayerDeclinedToJoinEvent = {
            party:this,
            pc:pc,
        };

        this.dispatch(PlayerPartyEvent.PlayerDeclined,eventData);
    }

    playerActionJoin(pc:PlayerCharacter){
        this.members.set(pc.uid,pc);

        this.invited.delete(pc.uid);

        pc._currentPartyData = {
            party: this
        };

        const eventData:PlayerJoinedEvent = {
            party:this,
            pc:pc,
        };

        this.dispatch(PlayerPartyEvent.PlayerJoined,eventData);
    }

    playerActionLeave(pc:PlayerCharacter){
        this.members.delete(pc.uid);

        pc._currentPartyData = null;

        const eventData:PlayerLeftEvent = {
            party:this,
            pc:pc,
        };

        this.dispatch(PlayerPartyEvent.PlayerLeft,eventData);
    }

    playerActionDisband(){
        const members:Array<PlayerCharacter> = [];

        this.members.forEach(function(pc){
            pc._currentPartyData = null;
        });

        this.invited.forEach(function(pc){
            pc._currentPartyData = null;
        });

        this.leader._currentPartyData = null;

        const eventData:PartyDisbandedEvent = {
            party:this
        };

        this.dispatch(PlayerPartyEvent.PartyDisbanded,eventData);
    }

    //Event methods
    on(event:PlayerPartyEvent,handler:Function){ this._events.on(event,handler); }
    off(event:PlayerPartyEvent,handler:Function){ this._events.off(event,handler); }
    dispatch<T>(event:PlayerPartyEvent,eventData:T){ this._events.dispatch(event,eventData); }
}

export enum PlayerPartyEvent{
    PlayerJoined,
    PlayerInvited,
    PlayerDeclined,
    PlayerLeft,
    PartyDisbanded
}

export interface PlayerJoinedEvent{
    party:PlayerParty,
    pc:PlayerCharacter,
}

export interface PlayerInvitedEvent{
    party:PlayerParty,
    pc:PlayerCharacter,
}

export interface PlayerDeclinedToJoinEvent{
    party:PlayerParty,
    pc:PlayerCharacter,
}

export interface PlayerLeftEvent{
    party:PlayerParty,
    pc:PlayerCharacter,
}

export interface PartyDisbandedEvent{
    party:PlayerParty
}
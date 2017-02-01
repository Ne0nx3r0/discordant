import PlayerCharacter from '../creature/player/PlayerCharacter';
import {DiscordTextChannel} from '../../bot/Bot';
import EventDispatcher from '../../util/EventDispatcher';
import PartyDisband from '../../bot/commands/party/PartyDisband';

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

        this.leader.currentPartyData = {
            party: this
        };
        
        this._events = new EventDispatcher();
    }

    get id():string{
        return this.leader.uid;
    }

    playerActionInvited(pc:PlayerCharacter){
        this.invited.set(pc.uid,pc);

        const eventData:PlayerInvitedEvent = {
            party: this,
            pc:pc,
        };

        this.dispatch(PlayerPartyEvent.PlayerInvited,eventData);
    }

    playerActionJoin(pc:PlayerCharacter){
        pc.pendingPartyInvite = null;

        this.members.set(pc.uid,pc);

        pc.currentPartyData = {
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

        pc.currentPartyData = null;

        const eventData:PlayerLeftEvent = {
            party:this,
            pc:pc,
        };

        this.dispatch(PlayerPartyEvent.PlayerLeft,eventData);
    }

    playerActionDisband(){
        const members:Array<PlayerCharacter> = [];

        this.members.forEach(function(pc){
            pc.currentPartyData = null;

            members.push(pc);
        });

        this.leader.currentPartyData = null;

        const eventData:PartyDisbandedEvent = {
            party:this
        };

        this.dispatch(PlayerPartyEvent.PartyDisbanded,eventData);

        this.leader = null;
        this.members = null;
    }

    //Event methods
    on(event:PlayerPartyEvent,handler:Function){ this._events.on(event,handler); }
    off(event:PlayerPartyEvent,handler:Function){ this._events.off(event,handler); }
    dispatch<T>(event:PlayerPartyEvent,eventData:T){ this._events.dispatch(event,eventData); }
}

export enum PlayerPartyEvent{
    PlayerJoined,
    PlayerInvited,
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

export interface PlayerLeftEvent{
    party:PlayerParty,
    pc:PlayerCharacter,
}

export interface PartyDisbandedEvent{
    party:PlayerParty
}
import PlayerCharacter from '../creature/player/PlayerCharacter';
import {PlayerPartyStatus} from '../creature/player/PlayerCharacter';
import {DiscordTextChannel} from '../../bot/Bot';
import EventDispatcher from '../../util/EventDispatcher';
import PartyDisband from '../../bot/commands/party/PartyDisband';
import PartyExploringMap from './PartyExploringMap';
import ExplorableMap from '../map/ExplorableMap';
import {PartyMoveDirection} from './PartyExploringMap';
import PartyMove from '../../bot/commands/party/PartyMove';
import CoopMonsterBattle from '../battle/CoopMonsterBattle';
import Game from '../Game';
import Goblin from '../creature/monsters/Goblin';
import { CoopMonsterBattleEvent, BattleEndEvent } from '../battle/CoopMonsterBattle';
import BattleMessengerDiscord from '../battle/BattleMessengerDiscord';

const INVITE_EXPIRES_MS = 60000;

enum PartyStatus{
    InTown,
    Exploring,
    Battling
}

export {PartyStatus};

export default class PlayerParty{
    leader:PlayerCharacter;
    title: string;
    members:Map<string,PlayerCharacter>;
    invited:Map<string,PlayerCharacter>;
    channel:DiscordTextChannel;
    partyStatus:PartyStatus;
    exploration:PartyExploringMap;
    currentBattle:CoopMonsterBattle;
    battleMessenger:BattleMessengerDiscord;
    game:Game;

    _events: EventDispatcher;

    constructor(title:string,leader:PlayerCharacter,channel:DiscordTextChannel,game:Game){
        this.leader = leader;
        this.title = title;
        this.channel = channel;

        this.members = new Map();
        this.members.set(leader.uid,leader);

        this.invited = new Map();
        this.partyStatus = PartyStatus.InTown;
        this.game = game;
        this.currentBattle = null;
        this.battleMessenger = null;

        this.leader.partyData = {
            party: this,
            status: PlayerPartyStatus.LeadingParty
        };
        
        this._events = new EventDispatcher();
    }

    get id():string{
        return this.leader.uid;
    }

    get status():PartyStatus{
        return this.partyStatus;
    }

    explore(map:ExplorableMap){
        this.exploration = new PartyExploringMap(map);
        this.partyStatus = PartyStatus.Exploring;

        const startingLocationImageSrc = this.exploration.getCurrentLocationImage();

        this.channel.sendFile(startingLocationImageSrc,'slice.png','Your party arrives...');
    }

    move(direction:PartyMoveDirection){
        if(!this.exploration.canMove(direction)){
            this.channel.sendMessage('The party cannot move '+direction+', the way is impassably blocked by a small bush or something.');

            return;
        }

        this.exploration.move(direction);

        if(this.exploration.getEncounterChance() > Math.random()){
            this.monsterEncounter();

            return;
        }

        const startingLocationImageSrc = this.exploration.getCurrentLocationImage();

        this.channel.sendFile(startingLocationImageSrc,'slice.png','Your party moved');
    }

    monsterEncounter(){
        const partyMembers = [];

        this.members.forEach(function(pc){
            partyMembers.push(pc);
        });

        this.channel.sendMessage('The party is attacked!');

        this.game.createMonsterBattle(partyMembers,new Goblin())
        .then((battle:CoopMonsterBattle)=>{
            this.currentBattle = battle; 
            this.battleMessenger = new BattleMessengerDiscord(battle,this.channel);
            this.partyStatus = PartyStatus.Battling;

            battle.on(CoopMonsterBattleEvent.BattleEnd,(e:BattleEndEvent)=>{
                if(e.victory){
                    this.partyStatus = PartyStatus.Exploring;
                
                    const startingLocationImageSrc = this.exploration.getCurrentLocationImage();

                    this.channel.sendFile(startingLocationImageSrc,'slice.png','Your party survived!');
                }
                else{
                    this.members.forEach((pc)=>{
                        this.channel.client.users.get(pc.uid).sendMessage('Your party was defeated!');
                    });

                    this.playerActionDisband();
                }

                this.currentBattle = null;
                this.battleMessenger = null;
            });
        })
        .catch((err)=>{
            this.channel.sendMessage('Error occured while finding encounter: '+err);
        });
    }

    playerActionInvite(pc:PlayerCharacter){
        this.invited.set(pc.uid,pc);

        pc.partyData = {
            status: PlayerPartyStatus.InvitedToParty,
            party: this,
            inviteExpires: new Date().getTime()+INVITE_EXPIRES_MS,
        };

        const eventData:PlayerInvitedEvent = {
            party: this,
            pc:pc,
        };

        this.dispatch(PlayerPartyEvent.PlayerInvited,eventData);

        const party = this;

        setTimeout(function(){
            //If this invite is still pending
            if(pc.partyData.status == PlayerPartyStatus.InvitedToParty
            && pc.partyData.party.id == party.id
            && 'inviteExpires' in pc.partyData){
                pc.partyData = {
                    status: PlayerPartyStatus.NoParty
                };
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

        pc.partyData = {
            status: PlayerPartyStatus.InParty,
            party: this,
        };

        const eventData:PlayerJoinedEvent = {
            party:this,
            pc:pc,
        };

        this.dispatch(PlayerPartyEvent.PlayerJoined,eventData);
    }

    playerActionLeave(pc:PlayerCharacter){
        this.members.delete(pc.uid);

        pc.partyData = {
            status: PlayerPartyStatus.NoParty
        };

        const eventData:PlayerLeftEvent = {
            party:this,
            pc:pc,
        };

        this.dispatch(PlayerPartyEvent.PlayerLeft,eventData);
    }

    playerActionDisband(){
        const members:Array<PlayerCharacter> = [];

        this.members.forEach(function(pc){
            pc.partyData = {
                status: PlayerPartyStatus.NoParty
            };
        });

        this.invited.forEach(function(pc){
            pc.partyData = {
                status: PlayerPartyStatus.NoParty
            };
        });

        this.leader.partyData = {
            status: PlayerPartyStatus.NoParty
        };

        const eventData:PartyDisbandedEvent = {
            party:this
        };

        this.dispatch(PlayerPartyEvent.PartyDisbanded,eventData);
    }

    get isInBattle():boolean{
        return this.partyStatus == PartyStatus.Battling;
    }

    get isInTown():boolean{
        return this.partyStatus == PartyStatus.InTown;
    }

    get isExploring():boolean{
        return this.partyStatus == PartyStatus.Exploring;
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
    PartyDisbanded,
    PartyAtNewLocation,
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

export interface PartyAtNewLocationEvent{
    imageSrc:string;
}
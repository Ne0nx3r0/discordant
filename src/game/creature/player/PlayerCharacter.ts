import Creature from '../Creature';
import DamageSet from '../../damage/IDamageSet';
import CharacterClass from './CharacterClass';
import AttributeSet from '../AttributeSet';
import Weapon from '../../item/Weapon';
import CreatureEquipment from '../../item/CreatureEquipment';
import CoopMonsterBattle from '../../battle/CoopMonsterBattle';
import AttackStep from '../../item/WeaponAttackStep';
import PlayerInventory from '../../item/PlayerInventory';
import PlayerParty from '../../party/PlayerParty';

enum PlayerPartyStatus{
    NoParty,
    InvitedToParty,
    InParty,
    LeadingParty
}

export {PlayerPartyStatus};

interface CurrentBattleData{
    battle:CoopMonsterBattle;
    defeated:boolean;
    attackExhaustion:number,
    queuedAttacks:Array<AttackStep>,
    blocking:boolean,
}

interface PartyData{
    status:PlayerPartyStatus;
    inviteExpires?:number;
    party?:PlayerParty;
}

interface PCConfig{
    id:number,
    uid:string;
    discriminator:number;
    title:string;
    description:string;
    attributes:AttributeSet,
    class:CharacterClass,
    equipment: CreatureEquipment,
    inventory: PlayerInventory,
    xp:number;
    wishes:number;
    role:string;
    karma:number;
}

export default class PlayerCharacter extends Creature{
    uid:string;
    discriminator:number;
    currentBattleData:CurrentBattleData;
    partyData:PartyData;
    PlayerPartyStatus:PlayerPartyStatus;
    class:CharacterClass;
    xp:number;
    wishes:number;
    inventory:PlayerInventory;
    role:string;
    karma:number;

    constructor(o:PCConfig){
        super({
            id: o.id,
            title: o.title,
            description: o.description,
            attributes: o.attributes,
            equipment: o.equipment
        });

        this.uid = o.uid;
        this.discriminator = o.discriminator;
        this.class = o.class;
        this.xp = o.xp;
        this.wishes = o.wishes;
        this.inventory = o.inventory;
        this.role = o.role;
        this.karma = o.karma;

        this.currentBattleData = null;
        this.partyData = {
            status: PlayerPartyStatus.NoParty
        };
    }

    get inBattle():boolean{
        return this.currentBattleData != null;
    }

    get inParty():boolean{
        return this.partyData.status == PlayerPartyStatus.InParty 
        || this.partyData.status == PlayerPartyStatus.LeadingParty;
    }

    get party():PlayerParty{
        return this.partyData.party;
    }

    //Has party data but expires is set marking it as an invite
    get hasPendingPartyInvite():boolean{
        return this.partyData.status == PlayerPartyStatus.InvitedToParty;
    }

    calculateDeathWishesLost():number{
        return this.wishes / 2;
    }

    calculateDeathXPLost():number{
        return this.xp * 0.01;
    }
}
import Creature from '../Creature';
import DamageSet from '../../damage/IDamageSet';
import CharacterClass from './CharacterClass';
import AttributeSet from '../AttributeSet';
import Weapon from '../../item/Weapon';
import CreatureEquipment from '../../item/CreatureEquipment';
import CoopBattle from '../../battle/CoopBattle';
import AttackStep from '../../item/WeaponAttackStep';
import PlayerInventory from '../../item/PlayerInventory';
import PlayerParty from '../../party/PlayerParty';
import InventoryItem from '../../item/InventoryItem';
import PlayerBattle from '../../battle/PlayerBattle';
import {PermissionRole} from '../../../permissions/PermissionsService';

type PlayerStatus = 'inCity' | 'invitedToPVPBattle' | 'inBattle' | 'invitedToParty' | 'inParty';

export {PlayerStatus};

interface BattleData{
    battle:PlayerBattle;
    defeated:boolean;
    attackExhaustion:number,
    queuedAttacks:Array<AttackStep>,
    blocking:boolean,
}

interface PartyData{
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
    role:PermissionRole;
    karma:number;
}

export default class PlayerCharacter extends Creature{
    uid:string;
    discriminator:number;
    battle:PlayerBattle;
    party:PlayerParty;
    status:PlayerStatus;
    class:CharacterClass;
    xp:number;
    wishes:number;
    inventory:PlayerInventory;
    role:PermissionRole;
    karma:number;
    lastCommand:number;

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

        this.status = 'inCity';
        this.party = null;
        this.battle = null;
        this.lastCommand = 0;
    }

    calculateDeathWishesLost():number{
        return this.wishes / 2;
    }

    calculateDeathXPLost():number{
        return this.xp * 0.01;
    }

    get isPartyLeader():boolean{
        return this.party && this.party.leader == this;
    }
}
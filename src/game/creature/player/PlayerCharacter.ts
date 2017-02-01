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

interface CurrentBattleData{
    battle:CoopMonsterBattle;
    defeated:boolean;
    attackExhaustion:number,
    queuedAttacks:Array<AttackStep>,
    blocking:boolean,
}

interface CurrentPartyData{
    party:PlayerParty;
}

export interface PendingPartyInvite{
    party:PlayerParty;
    expires:number;
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
    currentPartyData:CurrentPartyData;
    pendingPartyInvite:PendingPartyInvite;
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
        this.currentPartyData = null;
        this.pendingPartyInvite = null;
    }

    get inBattle():boolean{
        return this.currentBattleData != null;
    }

    get inParty():boolean{
        return this.currentPartyData != null;
    }

    get hasPendingPartyInvite():boolean{
        if(this.pendingPartyInvite != null){
            if(this.pendingPartyInvite.expires > new Date().getTime()){
                return true;
            }
            else{
                this.pendingPartyInvite = null;
            }
        }

        return false;
    }

    calculateDeathWishesLost():number{
        return this.wishes / 2;
    }

    calculateDeathXPLost():number{
        return this.xp * 0.01;
    }
}
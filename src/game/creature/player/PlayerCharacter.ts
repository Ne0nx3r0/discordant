import ICreature from '../ICreature';
import DamageSet from '../damage/DamageSet';
import CurrentBattleData from '../../battle/CurrentBattleData';
import CreatureType from '../CreatureType';
import CharacterClass from './CharacterClass';
import AttributeSet from './AttributeSet';
import Weapon from '../weapon/Weapon';
import Weapons from '../weapon/Weapons';

interface PCConfig{
    id:number,
    uid:string;
    discriminator:number;
    title:string;
    description:string;
    attributes:AttributeSet,
    class:CharacterClass,
    primaryWeapon?: Weapon,
    offhandWeapon?: Weapon,
    experience?:number;
    gold?:number;
}

export default class PlayerCharacter implements ICreature{
    //universal creature properties
    id:number;
    title:string;
    description:string;
    type:CreatureType;
    //totalHP
    currentHP:number;
    primaryWeapon:Weapon;
    offhandWeapon:Weapon;
    //resistances

    //Player specific properties
    uid:string;
    discriminator:number;
    currentBattleData:CurrentBattleData;
    class:CharacterClass;
    experience:number;
    attributes:AttributeSet;
    gold:number;

    constructor(o:PCConfig){
        this.id = o.id;
        this.uid = o.uid;
        this.discriminator = o.discriminator;
        this.title = o.title;
        this.description = o.description;
        this.attributes = o.attributes;
        this.class = o.class;
        this.primaryWeapon = o.primaryWeapon || Weapons.BareHands;
        this.offhandWeapon = o.offhandWeapon || Weapons.BareHands;
        this.experience = o.experience || 0;
        this.gold = o.gold || 0;

        this.currentHP = this.totalHP;
        this.currentBattleData = false;
    }

    get totalHP():number{
        return this.getStat('vitality') * 10;
    }

    get inBattle():boolean{
        return this.currentBattleData?true:false;
    }

    get resistances():DamageSet{
        const endurance = this.getStat('endurance');
        const enduranceResist = Math.min(endurance/100,0.9);
        const luckResist = Math.min(endurance/200 + this.getStat('luck')/200,0.7);
        
        return new DamageSet({
            Physical: 0,
            Fire: enduranceResist,
            Cold: enduranceResist,
            Thunder: enduranceResist,
            Chaos: luckResist,
        });
    }

    getStat(name:string):number{
        const attribute = this.attributes[name];

        if(attribute){
            return attribute + this.class.attributes[name];
        }

        return -1;
    }
}
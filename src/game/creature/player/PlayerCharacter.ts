import Creature from '../Creature';
import DamageSet from '../../damage/IDamageSet';
import CharacterClass from './CharacterClass';
import AttributeSet from '../AttributeSet';
import Weapon from '../../item/weapon/Weapon';
import CreatureEquipment from '../../item/CreatureEquipment';
import CoopMonsterBattle from '../../battle/CoopMonsterBattle';
import AttackStep from '../../item/weapon/WeaponAttackStep';

interface CurrentBattleData{
    battle:CoopMonsterBattle;
    defeated:boolean;
    attackExhaustion:number,
    queuedAttacks:Array<AttackStep>,
    blocking:boolean,
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
    xp:number;
    gold:number;
}

export default class PlayerCharacter extends Creature{
    uid:string;
    discriminator:number;
    currentBattleData:CurrentBattleData;
    class:CharacterClass;
    xp:number;
    gold:number;

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
        this.gold = o.gold;

        this.currentBattleData = null;
    }

    get inBattle():boolean{
        return this.currentBattleData != null;
    }

    calculateDeathGoldLost():number{
        return this.gold / 2;
    }

    calculateDeathXPLost():number{
        return this.xp * 0.01;
    }
}
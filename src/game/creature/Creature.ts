import DamageSet from '../damage/IDamageSet';
import Weapon from '../item/Weapon';
import AttributeSet from './AttributeSet';
import CreatureEquipment from '../item/CreatureEquipment';
import {EquipmentSlot} from '../item/CreatureEquipment';
import ItemEquippable from '../item/ItemEquippable';
import CreatureId from './CreatureId';
import IDamageSet from '../damage/IDamageSet';
import WeaponAttack from '../item/WeaponAttack';

export interface IStatSet{
    Strength:number,
    Agility:number,
    Vitality:number,
    Spirit:number,
    Luck:number,
    HPTotal:number,
    Resistances:IDamageSet,
}

export interface ICreatureBag{
    id:CreatureId;
    title:string;
    description:string;
    attributes:AttributeSet;
    equipment: CreatureEquipment;
}

export default class Creature{
    id:CreatureId;
    title:string;
    description:string;
    attributes:AttributeSet;
    equipment:CreatureEquipment;
    stats:IStatSet;
    HPCurrent:number;
    attacks:Array<WeaponAttack>;

    constructor(bag:ICreatureBag){
        this.id = bag.id;
        this.title = bag.title;
        this.description = bag.description;
        this.attributes = bag.attributes;
        this.equipment = bag.equipment;

        this.updateStats();
        this.HPCurrent = this.stats.HPTotal;
    }

    updateStats(){
        const stats:IStatSet = {
            Strength:this.attributes.Strength,
            Agility:this.attributes.Agility,
            Vitality:this.attributes.Vitality,
            Spirit:this.attributes.Spirit,
            Luck:this.attributes.Luck,
            Resistances:{
                Physical:0,
                Fire:0,
                Cold:0,
                Thunder:0,
                Chaos:0,
            },
            HPTotal: 0,
        };

        this.equipment.forEach(function(item:ItemEquippable,slot:EquipmentSlot){
            item.onAddBonuses(stats);
        });

        //These could be adjusted by bonuses
        stats.HPTotal = stats.Vitality * 10,

        stats.Resistances.Fire = Math.floor(stats.Agility/3)/100;
        stats.Resistances.Cold = Math.floor(stats.Strength/3)/100;
        stats.Resistances.Thunder = Math.floor(stats.Luck/3)/100;

        stats.Resistances.Chaos = Math.min(
            stats.Resistances.Physical,
            stats.Resistances.Fire,
            stats.Resistances.Cold,
            stats.Resistances.Thunder,
        );

        this.stats = stats;

        if(this.HPCurrent>this.stats.HPTotal) this.HPCurrent = this.stats.HPTotal;
    }

    _equipItem(item:ItemEquippable,slot:EquipmentSlot):ItemEquippable{
        const unEquipped = this.equipment._equipItem(item,slot);

        this.updateStats();

        return unEquipped;
    }

    _unEquipItem(slot:EquipmentSlot):ItemEquippable{
        const unEquipped = this.equipment._unequipItem(slot);

        this.updateStats();

        return unEquipped;
    }

    //May return nothing if no valid attacks or if no attacks that should be used right now
    getRandomAttack(){
        if(!this.attacks){
            throw "Only available for AI-controlled creatures";
        }

        //determine which attacks we can use right now and create a weighted pool
        const availableAttacks:Array<WeaponAttack> = [];
        let attacksWeightTotal = 0;

        this.attacks.forEach((attack)=>{
            if(attack.aiShouldIUseThisAttack(this)){
                availableAttacks.push(attack);

                attacksWeightTotal += attack.aiUseWeight;
            }
        });

        //choose an attack from the pool
        const roll = Math.random() * attacksWeightTotal;
        let currentWeight = 0;

        for(var i=0;i<availableAttacks.length;i++){
            const attack = availableAttacks[i];

            currentWeight += attack.aiUseWeight;

            if(roll < currentWeight){
                return attack;
            }
        }
    }

    //Returns what percent (0.0-0.95) of damage to block when blocking
    get damageBlocked():number{
        return Math.min(0.95,this.equipment.primaryweapon.damageBlocked + this.equipment.offhandweapon.damageBlocked);
    }
}
import DamageSet from '../damage/IDamageSet';
import Weapon from '../item/weapon/Weapon';
import AttributeSet from './AttributeSet';
import CreatureEquipment from '../item/CreatureEquipment';
import {EquipmentSlot} from '../item/CreatureEquipment';
import ItemEquippable from '../item/ItemEquippable';
import CreatureId from './CreatureId';
import IDamageSet from '../damage/IDamageSet';
import WeaponAttack from '../item/weapon/WeaponAttack';

interface IStatSet{
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
                Fire:Math.floor(this.attributes.Agility/3)/100,
                Cold:Math.floor(this.attributes.Strength/3)/100,
                Thunder:Math.floor(this.attributes.Luck/3)/100,
                Chaos:0,
            },
            HPTotal:this.attributes.Vitality*10,
        };

        if(this.equipment.armor) this.equipment.armor.onAddBonuses(stats);
        if(this.equipment.hat) this.equipment.hat.onAddBonuses(stats);
        if(this.equipment.ring) this.equipment.ring.onAddBonuses(stats);
        if(this.equipment.earring) this.equipment.earring.onAddBonuses(stats);
        if(this.equipment.amulet) this.equipment.amulet.onAddBonuses(stats);

        this.stats = stats;

        if(this.HPCurrent>this.stats.HPTotal) this.HPCurrent = this.stats.HPTotal;
    }

    equipItem(item:ItemEquippable,slot:EquipmentSlot):ItemEquippable{
        const unequippedItem = 

        this.updateStats();

        return null;
    }

    unEquipItem(slot:EquipmentSlot):ItemEquippable{
        //const removedItem = 

        this.updateStats();

        return null;
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
        return Math.min(0.95,this.equipment.primaryWeapon.damageBlocked + this.equipment.offhandWeapon.damageBlocked);
    }
}
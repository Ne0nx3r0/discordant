import Creature from './Creature';
import { ICreatureBag } from './Creature'; 
import WeaponAttack from '../item/weapon/WeaponAttack';
import WeaponAttackStep from '../item/weapon/WeaponAttackStep';

interface ICreatureAIBag extends ICreatureBag{
    xpDropped:number;
}

export default class CreatureAIControlled extends Creature{
    xpDropped:number;
    attacks:Array<WeaponAttack>;

    constructor(bag:ICreatureAIBag){
        super(bag);
        
        this.xpDropped = bag.xpDropped;

        this.attacks = [];

        if(bag.equipment.primaryWeapon){
            this.attacks = this.attacks.concat(bag.equipment.primaryWeapon.attacks);
        }
        if(bag.equipment.offhandWeapon){
            this.attacks = this.attacks.concat(bag.equipment.offhandWeapon.attacks);
        }
    }

    //May return nothing if no valid attacks or if no attacks that should be used right now
    getRandomAttack(){
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
}
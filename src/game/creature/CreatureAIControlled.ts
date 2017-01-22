import Creature from './Creature';
import ICreatureBag from './Creature'; 
import WeaponAttack from '../item/weapon/WeaponAttack';

interface ICreatureAIControlledBag extends ICreatureBag{

}

export default class CreatureAIControlled extends Creature{
    attacks:Array<WeaponAttack>;

    constructor(bag:ICreatureAIControlledBag){
        super(bag);

        this.attacks = [];

        if(bag.equipment.primaryWeapon){
            this.attacks = this.attacks.concat(bag.equipment.primaryWeapon.attacks);
        }
        if(bag.equipment.offhandWeapon){
            this.attacks = this.attacks.concat(bag.equipment.offhandWeapon.attacks);
        }
    }

    getRandomAttack(defender:Creature,master?:Creature){
        //determine which attacks we can use right now
        const availableAttacks = [];
        let attacksWeightTotal = 0;

        this.attacks.forEach((attack)=>{
            if(attack.aiShouldIUseThisAttack(this,defender,master)){
                availableAttacks.push(attack);

                attacksWeightTotal += attack.aiUseWeight;
            }
        });

        
    }
}
import Creature from '../Creature';
import CreatureType from '../CreatureType';
import Weapon from '../../item/weapon/Weapon';
import DamageSet from '../damage/DamageSet';
import CreatureSkin from '../../item/skins/CreatureSkin';
import AttributeSet from '../AttributeSet';
import CreatureEquipment from '../CreatureEquipment';
import ItemEquippable from '../../item/ItemEquippable';

export default class Monster extends Creature{
    constructor(id:number,title:string,description:string,attributes:AttributeSet,equipment){
        super({
            id: id,
            title: title,
            description: description,
            attributes: attributes,
            equipment: equipment,
        });

        this.attackWeightsTotal = this.attackWeights.reduce(function(total,current){
            return total.chance + current.chance;
        });
    }

    get creatureSkin():ItemEquippable{
        return this.equipment.armor;
    }

    getRandomAttack(){
        var randomWeight = Math.random() * this.attackWeightsTotal;
        var sumWeight = 0;

        for(var i=0;i<this.attackWeights.length;i++){
            var attackWeight = this.attackWeights[i];

            sumWeight += attackWeight.chance;

            if(randomWeight <= sumWeight){
                return attackWeight.attack;
            }
        }

        //should always find one in the loop
        throw "getRandomAttack: No attack found!";
    }
}
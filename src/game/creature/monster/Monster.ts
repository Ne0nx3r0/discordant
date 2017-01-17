import ICreature from '../ICreature';
import CreatureType from '../CreatureType';
import Weapon from '../weapon/Weapon';
import DamageSet from '../damage/DamageSet';

export default class Monster implements ICreature{
    id:number;
    title:string;
    description:string;
    creatureSkin:CreatureType;
    totalHP:number;
    currentHP:number;
    primaryWeapon:Weapon;
    offhandWeapon:Weapon;

    constructor(){

        this.attackWeightsTotal = this.attackWeights.reduce(function(total,current){
            return total.chance + current.chance;
        });
    }

    get resistances():DamageSet{
        return this.type.resistances;
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
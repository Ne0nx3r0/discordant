import Weapon from './Weapon';
import Attack from './Attack';
import AttackStep from './AttackStep';
import DamageSet from '../damage/DamageSet';
import ICreature from '../ICreature';
import DamageScaling from '../damage/DamageScaling';

const weaponTitleLookup:Map<string,Weapon> = new Map();
const weaponIdLookup:Map<number,Weapon> = new Map();

//see bottom for lookup caching

let idCardinality = 1;

const Weapons = {
    getByTitle(title:string):Weapon{
        return weaponTitleLookup.get(title);
    },
    getById(id:number):Weapon{
        return weaponIdLookup.get(id);
    },
    BareHands: new Weapon(
        idCardinality++,
        'Bare Hands',
        'When you bring knuckles to a knife fight',
        [
            new Attack(
                'swing',
                [
                    new AttackStep(
                        '{attacker} swings at {defender}',
                        5000,
                        function(attacker:ICreature,defender:ICreature,weapon:Weapon,master?:ICreature){
                            const resistances:DamageSet = defender.resistances;  

                            const physicalDamage = DamageScaling.ByAttribute(10,attacker.getStat('strength'));

                            return new DamageSet({
                                Physical: physicalDamage * (1-resistances.Physical)
                            });
                        }
                    )
                ],
                0.5
            ),
            new Attack(
                'jab',
                [
                    new AttackStep(
                        '{attacker} swings at {defender}',
                        5000,
                        function(attacker:ICreature,defender:ICreature,weapon:Weapon,master?:ICreature){
                            const resistances:DamageSet = defender.resistances;  

                            const physicalDamage = DamageScaling.ByAttribute(10,attacker.getStat('a'));

                            return new DamageSet({
                                Physical: physicalDamage * (1-resistances.Physical)
                            });
                        }
                    )
                ],
                0.5
            ),
        ]
    )
};

Object.keys(Weapon).forEach(function(key){
    const val = Weapon[key];

    if(val.constructor.name == 'Weapon'){
        weaponTitleLookup.set(val.title,val);
        weaponIdLookup.set(val.id,val);
    }
});

export default Weapons;
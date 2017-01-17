import Weapon from './Weapon';
import WeaponAttack from './WeaponAttack';
import WeaponAttackStep from './WeaponAttackStep';
import DamageSet from '../../damage/DamageSet';
import Creature from '../../creature/Creature';
import DamageScaling from '../../damage/DamageScaling';
import ItemId from '../ItemId';

const weaponTitleLookup:Map<string,Weapon> = new Map();
const weaponIdLookup:Map<number,Weapon> = new Map();

//see bottom for lookup caching

const scalesByStr = function(baseDamage:number){
    return function(attacker:Creature,defender:Creature,weapon:Weapon,master?:Creature){
        const resistances:DamageSet = defender.resistances;  

        const physicalDamage = DamageScaling.ByAttribute(baseDamage,attacker.getStat('strength'));

        return new DamageSet({
            Physical: physicalDamage * (1-resistances.Physical)
        });
    }
}

const scalesByDexterity = function(baseDamage:number){
    return function(attacker:Creature,defender:Creature,weapon:Weapon,master?:Creature){
        const resistances:DamageSet = defender.resistances;  

        const physicalDamage = DamageScaling.ByAttribute(baseDamage,attacker.getStat('dexterity'));

        return new DamageSet({
            Physical: physicalDamage * (1-resistances.Physical)
        });
    }
}

const Weapons = {
    getByTitle(title:string):Weapon{
        return weaponTitleLookup.get(title);
    },
    getById(id:number):Weapon{
        return weaponIdLookup.get(id);
    },
    BareHands: new Weapon(
        ItemId.BareHands,
        'Bare Hands',
        'When you bring knuckles to a knife fight',
        {},//no use requirements
        [
            new WeaponAttack(
                'swing',
                [
                    new WeaponAttackStep(
                        '{attacker} swings at {defender}',
                        5000,
                        scalesByStr(10)
                    )
                ],
                0.5
            ),
            new WeaponAttack(
                'jab',
                [
                    new WeaponAttackStep(
                        '{attacker} swings at {defender}',
                        5000,
                        function(attacker:Creature,defender:Creature,weapon:Weapon,master?:Creature){
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
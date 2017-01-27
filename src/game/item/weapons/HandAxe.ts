import Weapon from './Weapon';
import WeaponAttack from './WeaponAttack';
import WeaponAttackStep from './WeaponAttackStep';
import IDamageSet from '../../damage/IDamageSet';
import Creature from '../../creature/Creature';
import DamageScaling from '../../damage/DamageScaling';
import ItemId from '../ItemId';

export default new Weapon(
    ItemId.HandAxe,
    'Hand Axe',
    'A basic weapon whose history and use dates back to prehistoric times',
    0.05,
    {
        Strength: 10
    },//no use requirements
    [
        new WeaponAttack(
            'light',
            [
                new WeaponAttackStep(
                    '{attacker} swings a hand axe at {defender}',
                    1,
                    function(attacker:Creature,defender:Creature,master?:Creature){
                        const physicalDamage = DamageScaling.ByAttribute(10,attacker.stats.Strength);

                        return {
                            Physical: physicalDamage * (1-defender.stats.Resistances.Physical)
                        };
                    }
                )
            ],
            0.8
        ),
        new WeaponAttack(
            'heavy',
            [
                new WeaponAttackStep(
                    '{attacker} leaps at {defender} with their hand axe',
                    2,
                    function(attacker:Creature,defender:Creature,master?:Creature){
                        const physicalDamage = DamageScaling.ByAttribute(25,attacker.stats.Strength);

                        return {
                            Physical: physicalDamage * (1-defender.stats.Resistances.Physical)
                        };
                    }
                ),
            ],
            0.2
        ),
    ]
);
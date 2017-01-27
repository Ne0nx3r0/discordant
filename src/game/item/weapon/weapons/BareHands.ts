import Weapon from '../Weapon';
import WeaponAttack from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';
import IDamageSet from '../../../damage/IDamageSet';
import Creature from '../../../creature/Creature';
import DamageScaling from '../../../damage/DamageScaling';
import ItemId from '../../ItemId';

export default new Weapon(
    ItemId.BareHands,
    'Bare Hands',
    'When you bring knuckles to a knife fight',
    0.02,
    {},//no use requirements
    [
        new WeaponAttack(
            'light',
            [
                new WeaponAttackStep(
                    '{attacker} swings a fist at {defender}',
                    1,
                    function(attacker:Creature,defender:Creature,master?:Creature){
                        const physicalDamage = DamageScaling.ByAttribute(5,attacker.stats.Strength*2);

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
                    '{attacker} swings both fists at {defender}',
                    2,
                    function(attacker:Creature,defender:Creature,master?:Creature){
                        const physicalDamage = DamageScaling.ByAttribute(10,attacker.stats.Strength*2);

                        return {
                            Physical: physicalDamage * (1-defender.stats.Resistances.Physical)
                        };
                    }
                )
            ],
            0.2
        ),
    ]
);
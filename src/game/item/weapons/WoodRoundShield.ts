import Weapon from '../Weapon';
import WeaponAttack from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';
import IDamageSet from '../../damage/IDamageSet';
import Creature from '../../creature/Creature';
import DamageScaling from '../../damage/DamageScaling';
import ItemId from '../ItemId';

export default new Weapon(
    ItemId.WoodRoundShield,
    'Wood Round Shield',
    'A classic defense among foot soldiers and city guard, many of these were shattered as militia steel quelled the great beasts that took to roaming the plains.',
    0.30,
    {
        Strength: 10
    },
    [
        new WeaponAttack(
            'shove',
            [
                new WeaponAttackStep(
                    '{attacker} shoves {defender} with their shield',
                    1,
                    function(attacker:Creature,defender:Creature,master?:Creature){
                        const physicalDamage = DamageScaling.ByAttribute(5,attacker.stats.Strength);

                        return {
                            Physical: physicalDamage * (1-defender.stats.Resistances.Physical)
                        };
                    }
                )
            ],
            0.8
        ),
    ]
);
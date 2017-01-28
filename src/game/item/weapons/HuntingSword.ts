import Weapon from '../Weapon';
import WeaponAttack from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';
import IDamageSet from '../../damage/IDamageSet';
import Creature from '../../creature/Creature';
import DamageScaling from '../../damage/DamageScaling';
import ItemId from '../ItemId';

export default new Weapon(
    ItemId.HuntingSword,
    'Hunting Sword',
    'A straight, pointed blade used to quickly and silently finish off prey before its calls can alert other, larger predators to the meal.',
    0.05,
    {
        Strength: 12
    },//no use requirements
    [
        new WeaponAttack(
            'light',
            [
                new WeaponAttackStep(
                    '{attacker} slices {defender} with their hunting sword',
                    1,
                    function(attacker:Creature,defender:Creature,master?:Creature){
                        const physicalDamage = DamageScaling.ByAttribute(12,attacker.stats.Strength);

                        return {
                            Physical: physicalDamage * (1-defender.stats.Resistances.Physical)
                        };
                    }
                )
            ],
            0.5
        ),
        new WeaponAttack(
            'duo',
            [
                new WeaponAttackStep(
                    '{attacker} jumps behind and slashes {defender} with their hunting sword',
                    1,
                    function(attacker:Creature,defender:Creature,master?:Creature){
                        const physicalDamage = DamageScaling.ByAttribute(12,attacker.stats.Strength);

                        return {
                            Physical: physicalDamage * (1-defender.stats.Resistances.Physical)
                        };
                    }
                ),
                new WeaponAttackStep(
                    '{attacker} follows up with a stab to {defender}',
                    1,
                    function(attacker:Creature,defender:Creature,master?:Creature){
                        const physicalDamage = DamageScaling.ByAttribute(10,attacker.stats.Strength);

                        return {
                            Physical: physicalDamage * (1-defender.stats.Resistances.Physical)
                        };
                    }
                )
            ],
            0.5
        ),
    ]
);
import Weapon from '../Weapon';
import WeaponAttack from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';
import IDamageSet from '../../damage/IDamageSet';
import Creature from '../../creature/Creature';
import DamageScaling from '../../damage/DamageScaling';
import ItemId from '../ItemId';

export default new Weapon(
    ItemId.TabletOfHealing,
    'Table of Healing',
    'A basic weapon whose history and use dates back to prehistoric times',
    0.05,
    {
        Spirit: 16
    },
    [
        new WeaponAttack(
            'heal',
            [
                new WeaponAttackStep(
                    '{attacker} reads a legend outloud and heals 30HP',
                    1,
                    function(attacker:Creature,defender:Creature,master?:Creature){
                        attacker.HPCurrent = Math.min(attacker.stats.HPTotal,attacker.HPCurrent+30);

                        return {};
                    }
                )
            ],
            0.8
        ),
        new WeaponAttack(
            'megaheal',
            [
                new WeaponAttackStep(
                    '{attacker} begins reading a legend from their tablet',
                    1,
                    function(attacker:Creature,defender:Creature,master?:Creature){
                        return {};
                    }
                ),
                new WeaponAttackStep(
                    '{attacker} finishes their legend and fully heals',
                    1,
                    function(attacker:Creature,defender:Creature,master?:Creature){
                        attacker.HPCurrent = attacker.stats.HPTotal;

                        return {};
                    }
                ),
            ],
            0.2
        ),
    ]
);
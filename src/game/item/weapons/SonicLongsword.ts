import Weapon from '../Weapon';
import WeaponAttack from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';
import IDamageSet from '../../damage/IDamageSet';
import Creature from '../../creature/Creature';
import DamageScaling from '../../damage/DamageScaling';
import ItemId from '../ItemId';

export default new Weapon(
    ItemId.SonicLongsword,
    'Sonic Longsword',
    'A blade whose hilt generates an electric charge which is inflited on enemies',
    0.05,
    {
        Agility: 20
    },
    [
        new WeaponAttack(
            'light',
            [
                new WeaponAttackStep(
                    '{attacker} slashes {defender} with a sonic blade',
                    1,
                    function(attacker:Creature,defender:Creature,master?:Creature){
                        const thunderDamage = DamageScaling.ByAttribute(50,attacker.stats.Agility);

                        return {
                            Thunder: thunderDamage * (1-defender.stats.Resistances.Thunder)
                        };
                    }
                )
            ],
            0.8
        ),
    ]
);
import Weapon from '../Weapon';
import WeaponAttack from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';
import IDamageSet from '../../damage/IDamageSet';
import Creature from '../../creature/Creature';
import DamageScaling from '../../damage/DamageScaling';
import ItemId from '../ItemId';

export default new Weapon({
    id: ItemId.SonicLongsword,
    title: 'Sonic Longsword',
    description: 'A blade whose hilt generates an electric charge which is inflited on enemies',
    damageBlocked: 0.05,
    useRequirements:{
        Agility: 20
    },
    attacks: [
        new WeaponAttack({
            title: 'light',
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} slashes {defender} with a sonic blade',
                    exhaustion: 1,
                    damageFunc: function(attacker:Creature,defender:Creature,master?:Creature){
                        const thunderDamage = DamageScaling.ByAttribute(50,attacker.stats.Agility);

                        return {
                            Thunder: thunderDamage * (1-defender.stats.Resistances.Thunder)
                        };
                    }
                })
            ],
            aiUseWeight: 0.8
        }),
    ]
});
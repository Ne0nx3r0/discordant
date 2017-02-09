import Weapon from '../Weapon';
import WeaponAttack from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';
import IDamageSet from '../../damage/IDamageSet';
import Creature from '../../creature/Creature';
import DamageScaling from '../../damage/DamageScaling';
import ItemId from '../ItemId';

export default new Weapon({
    id: ItemId.TabletOfHealing,
    title: 'Tablet of Healing',
    description: 'A basic weapon whose history and use dates back to prehistoric times',
    damageBlocked: 0.05,
    useRequirements:{
        Spirit: 16
    },
    attacks: [
        new WeaponAttack({
            title: 'heal',
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} reads a legend outloud and heals 30HP',
                    exhaustion: 1,
                    damageFunc: function(attacker:Creature,defender:Creature,master?:Creature){
                        attacker.HPCurrent = Math.min(attacker.stats.HPTotal,attacker.HPCurrent+30);

                        return {};
                    }
                })
            ],
            aiUseWeight: 0.8
        }),
        new WeaponAttack({
            title: 'megaheal',
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} begins reading a legend from their tablet',
                    exhaustion: 1,
                    damageFunc: function(attacker:Creature,defender:Creature,master?:Creature){
                        return {};
                    }
                }),
                new WeaponAttackStep({
                    attackMessage: '{attacker} finishes their legend and fully heals',
                    exhaustion: 1,
                    damageFunc: function(attacker:Creature,defender:Creature,master?:Creature){
                        attacker.HPCurrent = attacker.stats.HPTotal;

                        return {};
                    }
                }),
            ],
            aiUseWeight: 0.2
        }),
    ]
});
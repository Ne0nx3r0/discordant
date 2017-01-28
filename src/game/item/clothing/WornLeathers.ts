import ItemEquippable from '../ItemEquippable';
import ItemId from '../ItemId';
import { EquipmentSlot } from '../CreatureEquipment';
import { IStatSet } from '../../creature/Creature';

class WornLeathers extends ItemEquippable{
    constructor(){
        super(
            ItemId.WornLeathers,
            'Worn Leathers',
            'A set of hardened animal hide braces that cover the chest, arms and legs (+20% Physical Resistance)',
            'armor'
        );
    }

    onAddBonuses(stats:IStatSet){
        stats.Resistances.Physical += 0.2;
    }
}

export default new WornLeathers();
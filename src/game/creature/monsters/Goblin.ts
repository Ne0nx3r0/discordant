import Creature from '../Creature';
import CreatureId from '../CreatureId';
import CreatureEquipment from '../../item/CreatureEquipment';
import {BareHands} from '../../item/weapon/WeaponsIndex';
import AttributeSet from '../AttributeSet';
import CreatureType from '../CreatureType';

export default class Goblin extends Creature{
    constructor(){
        super({
            id: CreatureId.Goblin,
            type: CreatureType.Opponent,
            title: 'Goblin',
            description: 'A low level generic creature',
            attributes: new AttributeSet(10,10,10,0,0),
            equipment: new CreatureEquipment({
                primaryWeapon: BareHands
            }),
        });
    }
}
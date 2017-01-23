import CreatureAIControlled from '../CreatureAIControlled';
import CreatureId from '../CreatureId';
import CreatureEquipment from '../../item/CreatureEquipment';
import {BareHands} from '../../item/weapon/weapons/WeaponsIndex';
import AttributeSet from '../AttributeSet';

export default class Goblin extends CreatureAIControlled{
    constructor(){
        super({
            id: CreatureId.Goblin,
            title: 'Goblin',
            description: 'A low level generic creature',
            attributes: new AttributeSet(10,10,20,0,0),
            equipment: new CreatureEquipment({
                primaryWeapon: BareHands
            }),
        });
    }
}
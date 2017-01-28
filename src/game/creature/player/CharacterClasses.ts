import CharacterClass from './CharacterClass';
import AttributeSet from '../AttributeSet';
import Collection from '../../../util/Collection';
import CreatureEquipment from '../../item/CreatureEquipment';
import WornLeathers from '../../item/clothing/WornLeathers';
import WoodRoundShield from '../../item/weapons/WoodRoundShield';
import HuntingSword from '../../item/weapons/HuntingSword';

enum CharacterClassId{
    Nobody,
    Mercanary
}

const classes = new Collection();

export default classes;

function addClass(c){
    classes.set(c.id,c);
}

addClass(new CharacterClass(
    CharacterClassId.Nobody,
    'Nobody',
    'Your path is your own, but you will receive no help along the way.',
    new AttributeSet(10,10,10,10,10),
    new CreatureEquipment({}),
));

addClass(new CharacterClass(
    CharacterClassId.Mercanary,
    'Mercanary',
    'Having lived a life of service you\'re ready to carve out a piece for yourself.',
    new AttributeSet(12,12,14,4,8),
    new CreatureEquipment({
        armor: WornLeathers,
        primaryweapon: HuntingSword,
        offhandweapon: WoodRoundShield,
    }),
));
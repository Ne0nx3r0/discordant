import CharacterClass from './CharacterClass';
import AttributeSet from '../AttributeSet';
import Collection from '../../../util/Collection';

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
    'Your path is your own, but you will receive no help along the way.\n\nStarting Equipment: None',
    new AttributeSet(10,10,10,10,10)
));

addClass(new CharacterClass(
    CharacterClassId.Mercanary,
    'Mercanary',
    'You have lived a live in service of others, now out to carve a piece for yourself.\n\nStarting Equipment: Worn Leathers, Hunting Sword, Wooden Round Shield',
    new AttributeSet(12,12,14,4,8)
));
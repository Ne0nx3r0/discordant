import CharacterClass from './CharacterClass';
import AttributeSet from '../AttributeSet';
import Collection from '../../../util/Collection';

const classes = new Collection();

export default classes;

function addClass(c){
    classes.set(c.id,c);
}

addClass(new CharacterClass(
    1,
    'Nobody',
    'Your path is your own, but you will receive no help along the way.',
    new AttributeSet(10,10,10,10,10,10)
));
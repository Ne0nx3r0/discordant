import DamageType from './damage/DamageType';
import DamageSet from './damage/DamageSet';
import CreatureType from './CreatureType';

const CreatureTypes = {};

export default CreatureTypes;

function addCreatureType(ct:CreatureType){
    //add lookups by TITLE and id
    CreatureTypes[ct.id] = CreatureType[ct.title.toUpperCase()] = ct;
}

addCreatureType(new CreatureType(
    0,
    'Human',
    new DamageSet({
        [DamageType.PHYSICAL]: 0,
        [DamageType.FIRE]: 0,
        [DamageType.COLD]: 0,
        [DamageType.THUNDER]: 0,
        [DamageType.CHAOS]: 0,
    })
));

addCreatureType(new CreatureType(
    1,
    'Beast',
    new DamageSet({
        [DamageType.PHYSICAL]: 0.20,
        [DamageType.FIRE]: -0.30,
        [DamageType.COLD]: 0.20,
        [DamageType.THUNDER]: -0.30,
        [DamageType.CHAOS]: 0,
    })
));

addCreatureType(new CreatureType(
    2,
    'Demon',
    {
        [DamageType.PHYSICAL]: 0.50,
        [DamageType.FIRE]: 0.50,
        [DamageType.COLD]: -0.50,
        [DamageType.THUNDER]: -0.50,
        [DamageType.CHAOS]: 0,
    }
));

addCreatureType(new CreatureType(
    3,
    'Ghost',
    {
        [DamageType.PHYSICAL]: 1,
        [DamageType.FIRE]: -0.50,
        [DamageType.COLD]: 0.50,
        [DamageType.THUNDER]: -0.50,
        [DamageType.CHAOS]: 0,
    }
));
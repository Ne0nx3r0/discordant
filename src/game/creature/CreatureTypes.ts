import DamageSet from '../damage/IDamageSet';
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
        Physical: 0,
        Fire: 0,
        Cold: 0,
        Thunder: 0,
        Chaos: 0,
    })
));

addCreatureType(new CreatureType(
    1,
    'Beast',
    new DamageSet({
        Physical: 0.20,
        Fire: -0.30,
        Cold: 0.20,
        Thunder: -0.30,
        Chaos: 0,
    })
));

addCreatureType(new CreatureType(
    2,
    'Demon',
    {
        Physical: 0.50,
        Fire: 0.50,
        Cold: -0.50,
        Thunder: -0.50,
        Chaos: 0,
    }
));

addCreatureType(new CreatureType(
    3,
    'Ghost',
    {
        Physical: 1,
        Fire: -0.50,
        Cold: 0.50,
        Thunder: -0.50,
        Chaos: 0,
    }
));
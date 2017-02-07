import ExplorableMap from './ExplorableMap';

const TestMap = new ExplorableMap(
    'test',
    require('../../../assets/maps/test/map.json'),
    require('../../../assets/maps/test/mapData.json')
);

export {
    TestMap
};
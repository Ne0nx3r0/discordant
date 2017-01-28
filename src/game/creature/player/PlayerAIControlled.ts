import CreatureAIControlled from '../CreatureAIControlled';
import PlayerCharacter from './PlayerCharacter';
import CreatureId from '../CreatureId';

export default class PlayerAIControlled extends CreatureAIControlled{
    constructor(pc:PlayerCharacter){
        super({
            id:CreatureId.PlayerCharacter,
            title:pc.title,
            description:pc.description,
            attributes:pc.attributes,
            equipment:pc.equipment,
            xpDropped: 0,
        });
    }
}
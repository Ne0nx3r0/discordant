import Creature from './Creature';
import * as CreaturesIndex from './CreaturesIndex';
import CreatureAIControlled from './CreatureAIControlled';

export default class AllCreatures{
    creatures:Map<number,CreatureAIControlled>;

    constructor(){
        this.creatures = new Map();

        Object.keys(CreaturesIndex).forEach((itemKey)=>{
            const creatures:CreatureAIControlled = CreaturesIndex[itemKey];
        
            this.creatures.set(creatures.id,creatures);
        });
    }

    get(id:number):CreatureAIControlled{
        return this.creatures.get(id);
    }

    findByTitle(title:string){
        const titleUpper = title.toUpperCase();

        for(const [creatureId, creature] of this.creatures){
            if(creature.title.toUpperCase() == titleUpper){
                return creature;
            }
        }
    }
}
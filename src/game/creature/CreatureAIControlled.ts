import Creature from './Creature';
import ICreatureBag from './Creature'; 

interface ICreatureAIControlledBag extends ICreatureBag{
    
}

export default class CreatureAIControlled extends Creature{
    constructor(bag:ICreatureAIControlledBag){
        super(bag);


    }
}
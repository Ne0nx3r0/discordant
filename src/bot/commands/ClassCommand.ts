import Command from './Command';
import Game from '../../game/Game';
import CharacterClass from '../../game/creature/player/CharacterClass';
import CharacterClasses from '../../game/creature/player/CharacterClasses';

export default class ClassCommand extends Command{
    constructor(){
        super(
            'class',
            'Shows information on starting classes',
            'class [name]',
            'user.class'
        );
    }

    run(params:Array<string>,message:any,game:Game){
        
    }
}
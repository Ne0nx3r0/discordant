import Command from './Command';
import Game from '../../game/Game';
import CharacterClass from '../../game/creature/player/CharacterClass';
import CharacterClasses from '../../game/creature/player/CharacterClasses';

export default class Battle extends Command{
    constructor(){
        super(
            'battle',
            'begin a battle',
            'battle',
            'user.battle'
        );
    }

    getAvailableClasses(){
        let classesStr = 'Available classes: ';

        const classes = CharacterClasses.forEach(function(c:CharacterClass,key){
            classesStr += c.title+', ';
        });

        return classesStr.slice(0,-2);
    }

    run(params:Array<string>,message:any,game:Game){
        

    }
}
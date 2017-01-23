import Command from './Command';
import Game from '../../game/Game';
import CharacterClass from '../../game/creature/player/CharacterClass';
import CharacterClasses from '../../game/creature/player/CharacterClasses';
import Goblin from '../../game/creature/monsters/Goblin';

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
        game.getPlayerCharacter(message.author.uid)
        .then(getPCResult)
        .catch(errFunc);

        function getPCResult(pc){
            if(!pc){
                message.reply('You must register first with dbegin');

                return;
            }

            if(pc.isInBattle){
                message.reply('You are in a battle already, omg defend yourself!');

                return;
            }

            game.createMonsterBattle([pc],new Goblin())
            .then(battleCreated)
            .catch(errFunc);

            function battleCreated(battle){
                message.reply('BATTLE!');
            }
        }


        function errFunc(err){
            message.reply(err);
        }
    }
}
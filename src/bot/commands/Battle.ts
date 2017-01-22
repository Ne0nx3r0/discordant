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
        if(params.length < 1){
            message.reply('You must choose a class\n\n'+this.getAvailableClasses());

            return;
        }

        const existingPlayer = game.getPlayerCharacter(message.author.id);

        if(!existingPlayer){
            message.reply('You have already begun');

            return;
        }

        const wantedClassStr = params[0];
        const wantedClassStrUpper = wantedClassStr.toUpperCase();

        const wantedClass:CharacterClass = CharacterClasses.find((val)=>{
            return val.title.toUpperCase() == wantedClassStrUpper;
        });

        if(!wantedClass){
            message.reply(params[0]+' is not a valid class\n\n'+this.getAvailableClasses());

            return;
        }

        game.registerPlayerCharacter({
            uid: message.author.id,
            discriminator: message.author.discriminator,
            username: message.author.username,
            class: wantedClass
        })
        .then(function(pc){
            message.reply('You have successfully been registered as a '+wantedClass.title+', good luck!');
        })
        .catch(function(err){
            message.reply(err);
        });
    }
}
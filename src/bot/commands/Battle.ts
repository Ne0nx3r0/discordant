import Command from './Command';
import Game from '../../game/Game';
import CharacterClass from '../../game/creature/player/CharacterClass';
import CharacterClasses from '../../game/creature/player/CharacterClasses';
import Goblin from '../../game/creature/monsters/Goblin';
import CoopMonsterBattle from '../../game/battle/CoopMonsterBattle';
import { CoopMonsterBattleEvent, PlayersAttackedEventData } from '../../game/battle/CoopMonsterBattle';
import PlayerCharacter from '../../game/creature/player/PlayerCharacter';
import IDamageSet from '../../game/damage/IDamageSet';

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
        function errFunc(err){
            message.reply(err);
        }

        game.getPlayerCharacter(message.author.id)
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
        }

        function battleCreated(battle:CoopMonsterBattle){
            battle.on(CoopMonsterBattleEvent.PlayersAttacked,onPlayerAttacked);
        }

        function onPlayerAttacked(e:PlayersAttackedEventData){
            let messageStr = 'Monster attacked!';
            
            e.players.forEach((pd)=>{
                const pc:PlayerCharacter = pd.pc;
                const damages:IDamageSet = pd.damages;

                messageStr += '\n'+pc.title+' damaged! '+JSON.stringify(damages);
            });

            message.channel.sendMessage(messageStr);
        }
    }
}
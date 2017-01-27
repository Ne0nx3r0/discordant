import Command from './Command';
import Game from '../../game/Game';
import CharacterClass from '../../game/creature/player/CharacterClass';
import CharacterClasses from '../../game/creature/player/CharacterClasses';
import PlayerCharacter from '../../game/creature/player/PlayerCharacter';
import CoopMonsterBattle from '../../game/battle/CoopMonsterBattle';

export default class ChannelId extends Command{
    constructor(){
        super(
            'block',
            '(in battle) blocks for the current round, reducing damage',
            'block',
            'user.battle.block'
        );
    }

    run(params:Array<string>,message:any,game:Game){
        const wantedAttackStr = params.join(' ').toUpperCase();

        game.getPlayerCharacter(message.author.id)
        .then(playerFound)
        .catch(function(error){message.reply(error);});

        function playerFound(pc:PlayerCharacter){
            if(!pc){
                message.reply('You must register first with begin');
            }
            else if(!pc.inBattle){
                message.reply('You are not currently in a battle');
            }
            else{
                playerBlock(pc);
            }
        }

        function playerBlock(pc:PlayerCharacter){
            pc.currentBattleData.battle
            .playerActionBlock(pc)
            .catch(function(error){message.reply(error);});
        }
    }
}
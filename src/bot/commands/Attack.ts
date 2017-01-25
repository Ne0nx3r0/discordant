import Command from './Command';
import Game from '../../game/Game';
import CharacterClass from '../../game/creature/player/CharacterClass';
import CharacterClasses from '../../game/creature/player/CharacterClasses';
import PlayerCharacter from '../../game/creature/player/PlayerCharacter';
import CoopMonsterBattle from '../../game/battle/CoopMonsterBattle';

export default class ChannelId extends Command{
    constructor(){
        super(
            'attack',
            '(in battle) attacks the monster with the default or a specific attack from held primary weapon',
            'attack [attackname]',
            'user.battle.attack'
        );
    }

    run(params:Array<string>,message:any,game:Game){
        const wantedAttackStr = params.join(' ').toUpperCase();

        game.getPlayerCharacter(message.author.id)
        .then(playerFound)
        .catch(this.fail(message.reply));

        function playerFound(pc:PlayerCharacter){
            if(!pc){
                message.reply('You must register first with begin');
            }
            else if(!pc.inBattle){
                message.reply('You are not currently in a battle');
            }
            else if(pc.currentBattleData.defeated){
                message.reply('You have already been defeated :(');
            }
            else{
                playerAttack(pc);
            }
        }

        function playerAttack(pc:PlayerCharacter){
            const pcWeaponPrimary = pc.equipment.primaryWeapon;
            const attack = pcWeaponPrimary.findAttack(wantedAttackStr);

            if(!attack){
                let validAttacks = get weapon's valid attacks

                message.reply(wantedAttackStr+' is not an attack '+pcWeaponPrimary.title+' has!');
            }
            else{
                pc.currentBattleData.battle.playerActionAttack()
            }
        }
    }
}
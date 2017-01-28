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
        .catch(function(error){message.reply(error);});

        function playerFound(pc:PlayerCharacter){
            if(!pc){
                message.reply('You must register first with begin');
            }
            else if(!pc.inBattle){
                message.reply('You are not currently in a battle');
            }
            else{
                playerAttack(pc);
            }
        }

        function playerAttack(pc:PlayerCharacter){
            const pcWeaponPrimary = pc.equipment.primaryweapon;
            let attack;
            
            if(params.length == 0){
                attack = pcWeaponPrimary.attacks[0];
            }
            else{
                attack = pcWeaponPrimary.findAttack(wantedAttackStr);
            }

            if(!attack){
                let validAttacks = '';

                pcWeaponPrimary.attacks.forEach((attack)=>{
                    validAttacks += ', '+attack.title;
                });

                message.reply(wantedAttackStr+' is not a valid attack, '+pcWeaponPrimary.title+' has: '+validAttacks.substr(2));
            }
            else{
                pc.currentBattleData.battle.playerActionAttack(pc,attack)
                .catch(function(error){message.reply(error);});
            }
        }
    }
}
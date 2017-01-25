import Command from './Command';
import Game from '../../game/Game';
import CharacterClass from '../../game/creature/player/CharacterClass';
import CharacterClasses from '../../game/creature/player/CharacterClasses';
import Goblin from '../../game/creature/monsters/Goblin';
import CoopMonsterBattle from '../../game/battle/CoopMonsterBattle';
import { CoopMonsterBattleEvent, PlayersAttackedEvent, BattleEndEvent, PlayerDeathEvent, PlayerBlockedEvent } from '../../game/battle/CoopMonsterBattle';
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
            battle.on(CoopMonsterBattleEvent.PlayersAttacked,function(e:PlayersAttackedEvent){
                let msg = '```md\n< '+e.message+' >\n```';

                e.players.forEach(function(playerDamage){
                    msg += '\n' + getDamagesLine(playerDamage.pc,playerDamage.damages,playerDamage.blocked);
                });

                message.channel.sendMessage(msg);
            });

            battle.on(CoopMonsterBattleEvent.PlayerDeath,function(e:PlayerDeathEvent){
                message.channel.sendMessage(':skull_crossbones:   '+e.pc.title + ' died! (Lost '+e.lostXP+' xp, '+e.lostGold+' gold)  :skull_crossbones:');
            });

            battle.on(CoopMonsterBattleEvent.BattleEnd,function(e:BattleEndEvent){
                message.channel.sendMessage('```fix\nBattle Over\n```');
            });

            battle.on(CoopMonsterBattleEvent.PlayerBlock,function(e:PlayerBlockedEvent){
                message.channel.sendMessage(':shield: '+e.pc.title + ' blocks! :shield:');
            });
        }        
    }
}

function getDamagesLine(pc:PlayerCharacter,damages:IDamageSet,blocked:boolean){
    let blockedStr = '';

    if(blocked){
        blockedStr = '**BLOCKED** ';
    }

    var line = '**'+pc.title+'** ('+pc.HPCurrent+'/'+pc.stats.HPTotal+') '+blockedStr+'took damage ';
    
    Object.keys(damages).forEach(function(damageStr:string){
        line += damages[damageStr] + ' ' + getDamageTypeEmoji(damageStr) + '   ';
    });

    return line.slice(0,-3);
}

function getDamageTypeEmoji(type:string){
    switch(type){
        case 'Physical': return ':crossed_swords:';
        case 'Fire': return ':fire:';
        case 'Cold': return ':snowflake:';
        case 'Thunder': return ':cloud_lightning:';
        case 'Chaos': return ':sparkles:';
    }

    return ':question:';
}
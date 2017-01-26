import Command from './Command';
import Game from '../../game/Game';
import CharacterClass from '../../game/creature/player/CharacterClass';
import CharacterClasses from '../../game/creature/player/CharacterClasses';
import Goblin from '../../game/creature/monsters/Goblin';
import CoopMonsterBattle from '../../game/battle/CoopMonsterBattle';
import { CoopMonsterBattleEvent, PlayersAttackedEvent, BattleEndEvent, PlayerDeathEvent, PlayerBlockedEvent, PlayerAttackEvent } from '../../game/battle/CoopMonsterBattle';
import PlayerCharacter from '../../game/creature/player/PlayerCharacter';
import IDamageSet from '../../game/damage/IDamageSet';
import Creature from '../../game/creature/Creature';

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
            }
            else if(pc.isInBattle){
                message.reply('You are in a battle already, omg defend yourself!');
            }
            else{
                game.createMonsterBattle([pc],new Goblin())
                .then(battleCreated)
                .catch(errFunc);
            }
        }

        function battleCreated(battle:CoopMonsterBattle){
            message.channel.sendMessage(battle.opponent.title+' rushes towards you, prepare for battle!');

            battle.on(CoopMonsterBattleEvent.PlayersAttacked,function(e:PlayersAttackedEvent){
                let msg = '```md\n< '+e.message+' >\n```';

                e.players.forEach(function(playerDamage){
                    msg += '\n' + getDamagesLine(playerDamage.pc,playerDamage.damages,playerDamage.blocked,playerDamage.pc.currentBattleData.attackExhaustion>1);
                });

                message.channel.sendMessage(msg);
            });

            battle.on(CoopMonsterBattleEvent.PlayerDeath,function(e:PlayerDeathEvent){
                message.channel.sendMessage(':skull_crossbones:   '+e.pc.title + ' died! (Lost '+e.lostXP+' xp, '+e.lostGold+' gold)  :skull_crossbones:');
            });

            battle.on(CoopMonsterBattleEvent.BattleEnd,function(e:BattleEndEvent){
                if(e.victory){
                    message.channel.sendMessage('```fix\n Battle Over \n```'
                    +'\n:tada: YOU WERE VICTORIOUS :tada: ');

                    e.survivingPCs.forEach((pc:PlayerCharacter)=>{
                        message.channel.sendMessage(pc.title+' earned '+e.xpEarned+'xp');
                    });
                }
                else{
                    message.channel.sendMessage('```fix\n Battle Over \n```'
                    +'\n:dizzy_face: YOU WERE DEFEATED :dizzy_face: ');
                }
            });

            battle.on(CoopMonsterBattleEvent.PlayerBlock,function(e:PlayerBlockedEvent){
                message.channel.sendMessage(':shield: '+e.pc.title + ' blocks! :shield:');
            });

            battle.on(CoopMonsterBattleEvent.PlayerAttack,function(e:PlayerAttackEvent){
                message.channel.sendMessage(e.message+'\n'+getDamagesLine(e.opponent,e.damages,false,false));

                const exhaustion = e.attackingPlayer.currentBattleData.attackExhaustion;

                if(exhaustion>1){
                    message.channel.sendMessage(e.attackingPlayer.title+' is exhausted for '
                    +(exhaustion-1)+' turn'+(exhaustion>2?'s':''));
                }
            });
        }        
    }
}

function getDamagesLine(pc:Creature,damages:IDamageSet,blocked:boolean,exhausted:boolean){
    let blockedStr = '';
    let exhaustedStr = '';

    if(blocked){
        blockedStr = '**BLOCKED** ';
    }

    if(exhausted){
        exhaustedStr = '**EXHAUSTED**';
    }

    var line = '**'+pc.title+'** '+exhaustedStr+' ('+pc.HPCurrent+'/'+pc.stats.HPTotal+') '+blockedStr+'took damage ';
    
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
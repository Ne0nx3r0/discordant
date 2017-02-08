import Command from '../../Command';
import Game from '../../../game/Game';
import CharacterClass from '../../../game/creature/player/CharacterClass';
import CharacterClasses from '../../../game/creature/player/CharacterClasses';
import Goblin from '../../../game/creature/monsters/Goblin';
import CoopMonsterBattle from '../../../game/battle/CoopMonsterBattle';
import { CoopMonsterBattleEvent, PlayersAttackedEvent, BattleEndEvent, PlayerDeathEvent, PlayerBlockedEvent, PlayerAttackEvent } from '../../../game/battle/CoopMonsterBattle';
import PlayerCharacter from '../../../game/creature/player/PlayerCharacter';
import IDamageSet from '../../../game/damage/IDamageSet';
import Creature from '../../../game/creature/Creature';
import { DiscordMessage, CommandBag } from '../../Bot';
import PermissionId from '../../../permissions/PermissionIds';

export default class Battle extends Command{
    constructor(){
        super(
            'battle',
            'begin a battle',
            'battle',
            PermissionId.Battle
        );
    }

    getAvailableClasses(){
        let classesStr = 'Available classes: ';

        const classes = CharacterClasses.forEach(function(c:CharacterClass,key){
            classesStr += c.title+', ';
        });

        return classesStr.slice(0,-2);
    }

    run(params:Array<string>,message:DiscordMessage,bag:CommandBag){
        if(bag.pc.isInBattle){
            message.channel.sendMessage('You are in a battle already, defend yourself!');

            return;
        }

        bag.game.createMonsterBattle([bag.pc],new Goblin())
        .then(battleCreated)
        .catch(errFunc);

        function battleCreated(battle:CoopMonsterBattle){
            message.channel.sendMessage(battle.opponent.title+' rushes towards you, prepare for battle!');

            battle.on(CoopMonsterBattleEvent.PlayersAttacked,function(e:PlayersAttackedEvent){
                let msg = '```md\n< '+e.message+' >\n```';
                let embedMsg = '';
                e.players.forEach(function(playerDamage){
                    embedMsg += '\n' + getDamagesLine(playerDamage.pc,playerDamage.damages,playerDamage.blocked,playerDamage.pc.battleData.attackExhaustion>1);
                });

                message.channel.sendMessage(msg)
                .catch(errFunc);

                message.channel.sendMessage('',getEmbed(embedMsg)).catch(errFunc);
            });

            battle.on(CoopMonsterBattleEvent.PlayerDeath,function(e:PlayerDeathEvent){
                message.channel.sendMessage(':skull_crossbones:   '+e.pc.title + ' died! (Lost '+e.lostWishes+' wishes)  :skull_crossbones:');
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
                let msg = e.message+'\n'+getDamagesLine(e.opponent,e.damages,false,false);

                const exhaustion = e.attackingPlayer.battleData.attackExhaustion;

                if(exhaustion>1){
                    msg+='\n'+e.attackingPlayer.title+' is exhausted for '
                    +(exhaustion-1)+' turn'+(exhaustion>2?'s':'');
                }

                message.channel.sendMessage('',getEmbed(msg,0xFFA500));
            });
        }          
        
        function errFunc(err){
            message.channel.sendMessage(err+', '+bag.pc.title);
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

function getColorLine(msg:string){
    return '```fix\n'+msg+'\n```';
}

function getEmbed(msg:string,color?:number){
    return {
        embed: {
            color: color || 0xFF6347, 
            description: msg,           
        }
    }
}
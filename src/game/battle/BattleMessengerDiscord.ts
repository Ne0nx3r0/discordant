import {DiscordTextChannel} from '../../bot/Bot';
import Creature from '../creature/Creature';
import IDamageSet from '../damage/IDamageSet';
import CoopMonsterBattle from './CoopMonsterBattle';
import { CoopMonsterBattleEvent, PlayersAttackedEvent, PlayerDeathEvent, BattleEndEvent, PlayerBlockedEvent, PlayerAttackEvent } from './CoopMonsterBattle';
import PlayerCharacter from '../creature/player/PlayerCharacter';

export default class BattleMessengerDiscord{
    battle:CoopMonsterBattle;
    channel:DiscordTextChannel;

    constructor(battle:CoopMonsterBattle,channel:DiscordTextChannel){
        this.battle = battle;
        this.channel = channel;
        
        function errFunc(err){
            this.channel.sendMessage(err);
        }      

        battle.on(CoopMonsterBattleEvent.PlayersAttacked,(e:PlayersAttackedEvent)=>{
            let msg = '```md\n< '+e.message+' >\n```';
            let embedMsg = '';

            e.players.forEach(function(playerDamage){
                embedMsg += '\n' + getDamagesLine(playerDamage.pc,playerDamage.damages,playerDamage.blocked,playerDamage.pc.battleData.attackExhaustion>1);
            });

            this.channel.sendMessage(msg)
            .catch(errFunc);

            this.channel.sendMessage('',getEmbed(embedMsg)).catch(errFunc);
        });

        battle.on(CoopMonsterBattleEvent.PlayerDeath,(e:PlayerDeathEvent)=>{
            this.channel.sendMessage(':skull_crossbones:   '+e.pc.title + ' died! (Lost '+e.lostWishes+' wishes)  :skull_crossbones:');
        });

        battle.on(CoopMonsterBattleEvent.BattleEnd,(e:BattleEndEvent)=>{
            if(e.victory){
                this.channel.sendMessage('```fix\n Battle Over \n```'
                +'\n:tada: YOU WERE VICTORIOUS :tada: ');

                e.survivingPCs.forEach((pc:PlayerCharacter)=>{
                    this.channel.sendMessage(pc.title+' earned '+e.xpEarned+'xp');
                });
            }
            else{
                this.channel.sendMessage('```fix\n Battle Over \n```'
                +'\n:dizzy_face: YOU WERE DEFEATED :dizzy_face: ');
            }
        });

        battle.on(CoopMonsterBattleEvent.PlayerBlock,(e:PlayerBlockedEvent)=>{
            this.channel.sendMessage(':shield: '+e.pc.title + ' blocks! :shield:');
        });

        battle.on(CoopMonsterBattleEvent.PlayerAttack,(e:PlayerAttackEvent)=>{
            let msg = e.message+'\n'+getDamagesLine(e.opponent,e.damages,false,false);

            const exhaustion = e.attackingPlayer.battleData.attackExhaustion;

            if(exhaustion>1){
                msg+='\n'+e.attackingPlayer.title+' is exhausted for '
                +(exhaustion-1)+' turn'+(exhaustion>2?'s':'');
            }

            this.channel.sendMessage('',getEmbed(msg,0xFFA500));
        });
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
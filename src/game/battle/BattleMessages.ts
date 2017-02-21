import { IPlayerBattle, IBattlePlayer, IPvPBattleEndEvent } from './IPlayerBattle';
import {DiscordTextChannel} from '../../bot/Bot';
import Creature from '../creature/Creature';
import IDamageSet from '../damage/IDamageSet';
import {IBattleAttackEvent,IBattleAttacked} from './IPlayerBattle';

export default {
    sendRoundBegan:function(channel:DiscordTextChannel){
        channel.sendMessage('```css\n--- NEW ROUND ---\n```');
    },

    sendAttacked:function(channel:DiscordTextChannel,attack:IBattleAttackEvent){
        let embed = '';

        embed += attack.message+'\n';

        attack.attacked.forEach(function(attacked:IBattleAttacked){
            embed += getDamagesLine(
                attacked.creature,
                attacked.damages,
                attacked.blocked,
                attacked.exhaustion
            )+'\n';
        });

        channel.sendMessage('',getEmbed(embed,EMBED_COLORS.attack));
    },

    sendBlocked:function(channel:DiscordTextChannel,blockerTitle:string){
        channel.sendMessage(`:shield: ${blockerTitle} blocks! :shield:`);
    },

    sendPassedOut:function(channel:DiscordTextChannel,creatureTitle:string,lostWishes?:number){
        const wishesLost = lostWishes?` (Lost ${lostWishes} wishes)`:'';

        channel.sendMessage(`:skull_crossbones: ${creatureTitle} passed out!${wishesLost} :skull_crossbones:`);
    },

    sendPvPBattleEnded:function(channel:DiscordTextChannel,e:IPvPBattleEndEvent){
        channel.sendMessage('```diff\nBattle Over\n```');

        channel.sendMessage('',getEmbed(`:tada: ${e.winner.pc.title} has defeated ${e.loser.pc.title} :tada:`));
    }
}

const EMBED_COLORS = {
    newRound: 0xFFA500,
    attack: 0xFFA500,
};

function getEmbed(msg:string,color?:number){
    return {
        embed: {
            color: color || 0xFFFFFF, 
            description: msg,           
        }
    }
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

function getDamagesLine(pc:Creature,damages:IDamageSet,blocked:boolean,exhausted:number){
    let blockedStr = '';
    let exhaustedStr = '';

    if(blocked){
        blockedStr = '**BLOCKED** ';
    }

    if(exhausted>0){
        exhaustedStr = '**EXHAUSTED ('+exhausted+')**';
    }

    var line = '**'+pc.title+'** '+exhaustedStr+' ('+pc.HPCurrent+'/'+pc.stats.HPTotal+') '+blockedStr+'took damage ';
    
    Object.keys(damages).forEach(function(damageStr:string){
        line += damages[damageStr] + ' ' + getDamageTypeEmoji(damageStr) + '   ';
    });

    return line.slice(0,-3);
}
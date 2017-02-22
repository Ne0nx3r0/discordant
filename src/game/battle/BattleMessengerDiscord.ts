import {DiscordTextChannel} from '../../bot/Bot';
import Creature from '../creature/Creature';
import IDamageSet from '../damage/IDamageSet';
import CoopBattle from './CoopBattle';
import PlayerCharacter from '../creature/player/PlayerCharacter';
import { BattleEvent, IBattleAttackEvent, IBattlePlayerDefeatedEvent, ICoopBattleEndEvent, IBattleBlockEvent, IPvPBattleEndEvent, IBattleRoundBeginEvent } from './PlayerBattle';
import PlayerBattle from './PlayerBattle';

export default function BattleMessengerDiscord(battle:PlayerBattle,channel:DiscordTextChannel){
    battle.on(BattleEvent.RoundBegin,function(e:IBattleRoundBeginEvent){
        sendRoundBegan(channel);
    });

    battle.on(BattleEvent.Attack,(e:IBattleAttackEvent)=>{
        sendAttacked(channel,e);
    });

    battle.on(BattleEvent.Block,(e:IBattleBlockEvent)=>{
        sendBlocked(channel,e.blocker.pc.title);
    });

    battle.on(BattleEvent.PlayerDefeated,(e:IBattlePlayerDefeatedEvent)=>{
        sendPassedOut(channel,e.player.pc.title);
    });

    battle.on(BattleEvent.CoopBattleEnd,(e:ICoopBattleEndEvent)=>{
       sendCoopBattleEnded(channel,e);
    });

    battle.on(BattleEvent.PvPBattleEnd,function(e:IPvPBattleEndEvent){
        sendPvPBattleEnded(channel,e);


    });
}

function sendRoundBegan(channel:DiscordTextChannel){
    channel.sendMessage('```css\n--- NEW ROUND ---\n```');
}

function sendAttacked(channel:DiscordTextChannel,attack:IBattleAttackEvent){
    let embed = attack.message;

    attack.attacked.forEach(function(attacked){

        embed += '\n'+getDamagesLine(
            attacked.creature,
            attacked.damages,
            attacked.blocked,
            attacked.exhaustion
        );
    });

    channel.sendMessage('',getEmbed(embed,EMBED_COLORS.attack));
}

function sendBlocked(channel:DiscordTextChannel,blockerTitle:string){
    channel.sendMessage(`:shield: ${blockerTitle} blocks! :shield:`);
}

function sendPassedOut(channel:DiscordTextChannel,creatureTitle:string,lostWishes?:number){
    const wishesLost = lostWishes?` (Lost ${lostWishes} wishes)`:'';

    channel.sendMessage(`:skull_crossbones: ${creatureTitle} passed out!${wishesLost} :skull_crossbones:`);
}

function sendPvPBattleEnded(channel:DiscordTextChannel,e:IPvPBattleEndEvent){
    channel.sendMessage('```fix\nBattle Over\n```');

    channel.sendMessage('',getEmbed(`:tada: ${e.winner.pc.title} has defeated ${e.loser.pc.title} :tada:`));
}

function sendCoopBattleEnded(channel:DiscordTextChannel,e:ICoopBattleEndEvent){
    channel.sendMessage('```fix\nBattle Over\n```');

    if(e.victory){
        channel.sendMessage('',getEmbed('\n:tada: YOU WERE VICTORIOUS :tada:',EMBED_COLORS.victorious));
    }
    else{
        channel.sendMessage('',getEmbed('\n:dizzy_face: YOU WERE DEFEATED :dizzy_face:',EMBED_COLORS.defeated));
    }
}

const EMBED_COLORS = {
    newRound: 0xFFA500,
    victorious: 0xFFA500,
    attack: 0xFFA500,
    defeated: 0x000000,
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
        blockedStr = ' BLOCKED';
    }

    if(exhausted>0){
        exhaustedStr = ' EXHAUSTED ('+exhausted+')';
    }

    var line = '**'+pc.title+'**'+exhaustedStr+' ('+pc.HPCurrent+'/'+pc.stats.HPTotal+')'+blockedStr+' took damage ';
    
    Object.keys(damages).forEach(function(damageStr:string){
        line += damages[damageStr] + ' ' + getDamageTypeEmoji(damageStr) + '   ';
    });

    return line.slice(0,-3);
}
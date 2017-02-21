import {DiscordTextChannel} from '../../bot/Bot';
import Creature from '../creature/Creature';
import IDamageSet from '../damage/IDamageSet';
import CoopMonsterBattle from './CoopBattle';
import { CoopMonsterBattleEvent, PlayersAttackedEvent, PlayerDeathEvent, BattleEndEvent, PlayerBlockedEvent, PlayerAttackEvent } from './CoopBattle';
import PlayerCharacter from '../creature/player/PlayerCharacter';
import BattleMessages from './BattleMessages';

export default function BattleMessengerDiscord(battle:CoopMonsterBattle,channel:DiscordTextChannel){
    function errFunc(err){
        channel.sendMessage(err);
    }      

    battle.on(CoopMonsterBattleEvent.PlayersAttacked,(e:PlayersAttackedEvent)=>{
        let msg = '```md\n< '+e.message+' >\n```';
        let embedMsg = '';

        e.players.forEach(function(playerDamage){
            embedMsg += '\n' + getDamagesLine(playerDamage.bpc.pc,playerDamage.damages,playerDamage.blocked,playerDamage.bpc.exhaustion>1);
        });

        channel.sendMessage(msg)
        .catch(errFunc);

        channel.sendMessage('',getEmbed(embedMsg)).catch(errFunc);
    });

    battle.on(CoopMonsterBattleEvent.PlayerDeath,(e:PlayerDeathEvent)=>{
        BattleMessages.sendPassedOut(channel,e.bpc.pc.title,e.lostWishes);
    });

    battle.on(CoopMonsterBattleEvent.BattleEnd,(e:BattleEndEvent)=>{
        if(e.victory){
            channel.sendMessage('```fix\n Battle Over \n```'
            +'\n:tada: YOU WERE VICTORIOUS :tada: ');

            e.pcs.forEach((bpc)=>{
                if(!bpc.defeated){ 
                    channel.sendMessage(bpc.pc.title+' earned '+e.opponent.getExperienceEarned(bpc.pc)+'xp');
                }
            });
        }
        else{
            channel.sendMessage('```fix\n Battle Over \n```'
            +'\n:dizzy_face: YOU WERE DEFEATED :dizzy_face: ');
        }
    });

    battle.on(CoopMonsterBattleEvent.PlayerBlock,(e:PlayerBlockedEvent)=>{
        BattleMessages.sendBlocks(channel,e.bpc.pc.title);
    });

    battle.on(CoopMonsterBattleEvent.PlayerAttack,(e:PlayerAttackEvent)=>{
        BattleMessages.sendAttack(channel,{
            battle:e.battle,
            message:e.message
            attacked: e.
        });
    });
}
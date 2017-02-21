import Command from '../Command';
import Game from '../../game/Game';
import { DiscordMessage, CommandBag, BotBag } from '../Bot';
import PermissionId from '../../permissions/PermissionIds';
import { PvPInvite } from '../../game/Game';
import PvPBattleMessengerDiscord from '../../game/battle/PvPBattleMessengerDiscord';
import { PvPBattleEvent, PvPBattleRoundBeginEvent, PvPBattleEndEvent } from '../../game/battle/PvPBattle';
import { IBattleAttackEvent, IBattleBlockEvent } from '../../game/battle/IPlayerBattle';
import BattleMessages from '../../game/battle/BattleMessages';

export default class Challenge extends Command{
    constructor(){
        super(
            'challenge',
            'Challenges a player to a duel or accepts',
            'dchallenge <\@player | accept>',
            PermissionId.Challenge
        );
    }

    run(params:Array<string>,message:DiscordMessage,bag:CommandBag){
        if(params.length < 1){
            bag.respond(this.getUsage());

            return;
        }

        if(bag.pc.status != 'inCity'){
            bag.respond(`You cannot send challenges right now, ${bag.pc.title}`);

            return;
        }

        if(params[0] == 'accept'){
            const invite = bag.game.getPvPInvite(bag.pc);

            if(!invite){
                bag.respond('You do not have a pending invite, '+bag.pc.title);

                return;
            }

            //It's time to D-D-D-D-D-D-D-D-duuuuel
            (async()=>{
                try{
                    const battle = bag.game.createPvPBattle(invite);

                    const channel = await bag.bot.createPvPChannel(message.guild,invite);

                    battle.on(PvPBattleEvent.RoundBegin,function(e:PvPBattleRoundBeginEvent){
                        BattleMessages.sendRoundBegan(channel);
                    });

                    battle.on(PvPBattleEvent.PlayerAttack,function(e:IBattleAttackEvent){
                        BattleMessages.sendAttacked(channel,e);
                    });

                    battle.on(PvPBattleEvent.PlayerBlock,function(e:IBattleBlockEvent){
                        BattleMessages.sendBlocked(channel,e.blocker.pc.title);
                    });

                    battle.on(PvPBattleEvent.BattleEnd,function(e:PvPBattleEndEvent){
                        BattleMessages.sendPvPBattleEnded(channel,e);
                    });

                    bag.respond(`The duel between <@${invite.sender.title}> and <@${invite.receiver.title}> begins in 30 seconds in <#${channel.id}>`);
                }
                catch(ex){
                    bag.respond(ex+', '+bag.pc.title);

                    return;
                }
            })();

            return;
        }

        const userTag = this.getTagUID(params[0]);

        (async()=>{
            try{
                const challengedPC = await bag.game.getPlayerCharacter(userTag);

                if(!challengedPC){
                    bag.respond('That user has not registered yet, '+bag.pc.title);

                    return;
                }

                if(challengedPC.status != 'inCity'){
                    bag.respond('That user cannot receive a challenge right now, '+bag.pc.title);

                    return;
                }

                bag.game.createPvPInvite(bag.pc,challengedPC);

                bag.respond(`<@${bag.pc.uid} challenged <@${challengedPC.uid}> to a duel! (expires in 60 seconds)`);
            }
            catch(ex){
                bag.respond(ex+', '+bag.pc.title);
            }
        })();
    }
}
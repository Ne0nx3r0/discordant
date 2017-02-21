import {IPlayerBattle} from './IPlayerBattle';
import {DiscordTextChannel} from '../../bot/Bot';
import Creature from '../creature/Creature';
import IDamageSet from '../damage/IDamageSet';
import {IBattleAttackEvent,IBattleAttacked} from './IPlayerBattle';
import PvPBattle from './PvPBattle';
import { PvPBattleEvent, PvPBattleRoundBeginEvent, PvPBattleEndEvent, PvPBattlePlayerBlockEvent, PvPBattlePlayerAttackEvent } from './PvPBattle';
import BattleMessages from './BattleMessages';

export default function PvPBattleMessengerDiscord(battle:PvPBattle,channel:DiscordTextChannel){
    battle.on(PvPBattleEvent.RoundBegin,function(e:PvPBattleRoundBeginEvent){
        BattleMessages.sendRoundBegin(channel);
    });

    battle.on(PvPBattleEvent.PlayerAttack,function(e:PvPBattlePlayerAttackEvent){
        implement this
    });

    battle.on(PvPBattleEvent.PlayerBlock,function(e:PvPBattlePlayerBlockEvent){
        implement this
    });

    battle.on(PvPBattleEvent.BattleEnd,function(e:PvPBattleEndEvent){
        implement this
    });
}
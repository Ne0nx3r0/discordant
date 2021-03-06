import BattleTemporaryEffect from '../BattleTemporaryEffect';
import EffectId from '../EffectId';
import { EffectEventBag } from '../BattleTemporaryEffect';
import { IStatSet } from '../../creature/Creature';
import IDamageSet from '../../damage/IDamageSet';
import EmbedColors from '../../../util/EmbedColors';

export default new BattleTemporaryEffect({
    id: EffectId.Test,
    title:'Test Effect',
    onAdded: function(bag:EffectEventBag){
        bag.sendBattleEmbed('TEST EFFECT: Added',EmbedColors.TEST);
    },
    onAddBonuses: function(stats:IStatSet){
        stats.Vitality
    },
    onRoundBegin: function(bag:EffectEventBag){
        bag.sendBattleEmbed('TEST EFFECT: Round Began',EmbedColors.TEST);
    },
    onAttack: function(bag:EffectEventBag,damages:IDamageSet){
        if(Math.random>Math.random){
            bag.sendBattleEmbed('TEST EFFECT: Denied attack',EmbedColors.TEST);
            return false;
        }

        bag.sendBattleEmbed('TEST EFFECT: Allowed attack',EmbedColors.TEST);
        return true;
    },
    onAttacked: function(bag:EffectEventBag,damages:IDamageSet){
        if(Math.random>Math.random){
            bag.sendBattleEmbed('TEST EFFECT: Denied attacked',EmbedColors.TEST);
            return false;
        }

        bag.sendBattleEmbed('TEST EFFECT: Allowed attacked',EmbedColors.TEST);
        return true;
    },
    onRemoved: function(bag:EffectEventBag){
        bag.sendBattleEmbed('TEST EFFECT: Removed',EmbedColors.TEST);
    },
});
import BattleTemporaryEffect from './BattleTemporaryEffect';
import EmbedColors from '../../util/EmbedColors';

export default class PoisonEffect extends BattleTemporaryEffect{
    constructor(poisonName:string,damagePerRound:number){
        super({
            onRoundEnd:function(bag){
                bag.target.HPCurrent -= damagePerRound;

                bag.sendBattleEmbed(`${bag.target.title} ${bag.target.HPCurrent}/${bag.target.stats.HPTotal} lost ${damagePerRound}HP from poison ${poisonName}`,EmbedColors.POISON);
            }
        });
    }
}

/* Usage:
pc.addTemporaryEffect(4,new PoisonEffect('Chicken Blood Extract',10));
*/
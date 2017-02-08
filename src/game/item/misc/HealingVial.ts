import ItemBase from '../ItemBase';
import ItemId from '../ItemId';
import ItemUsable from '../ItemUsable';
import PlayerCharacter from '../../creature/player/PlayerCharacter';

export default new ItemUsable(
    ItemId.HealingVial,
    'Healing Vial',
    'A small vial of glowing water which heals 25 points of health when drank. After a chance encounter a healer discovered a method of using wish stones to create liquid healing. It was only a matter of time before savvy investors capitalized on the art.',
    function(user:PlayerCharacter):boolean{
        if(user.HPCurrent >= user.stats.HPTotal){
            return false;
        }

        user.HPCurrent = Math.min(user.stats.HPTotal,user.HPCurrent+25);

        return true;
    }
);
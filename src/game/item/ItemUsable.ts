import ItemBase from './ItemBase';
import {ItemBaseBag} from './ItemBase';
import PlayerCharacter from '../creature/player/PlayerCharacter';

interface ItemUseFunction{
    (user:PlayerCharacter):boolean;
}

interface ItemUsableBag extends ItemBaseBag{
    onUse: ItemUseFunction;
}

export default class ItemUsable extends ItemBase{
    _useFunc: ItemUseFunction;

    constructor(bag:ItemUsableBag){
        super({
            id:bag.id,
            title:bag.title,
            description:bag.description,
            hiddenDescription:bag.hiddenDescription,
            hiddenDescriptionLoreNeeded:bag.hiddenDescriptionLoreNeeded
        });

        this._useFunc = bag.onUse;
    }

    onUse(user:PlayerCharacter):boolean{
        return this._useFunc(user);
    }
}
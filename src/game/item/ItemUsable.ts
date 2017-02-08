import ItemBase from './ItemBase';
import PlayerCharacter from '../creature/player/PlayerCharacter';

interface ItemUseFunction{
    (user:PlayerCharacter):boolean;
}

export default class ItemUsable extends ItemBase{
    useFunc: ItemUseFunction;

    constructor(id:number,title:string,description:string,useFunc:ItemUseFunction){
        super(
            id,
            title,
            description,
        );

        this.useFunc = useFunc;
    }

    onUsed(user:PlayerCharacter):boolean{
        return this.useFunc(user);
    }
}
import AllItems from './item/AllItems';

export default class Game{
    items:AllItems;

    constructor(){
        this.items = new AllItems();
    }
}
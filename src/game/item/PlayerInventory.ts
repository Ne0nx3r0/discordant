import InventoryItem from './InventoryItem';
import Collection from '../../util/Collection';
import ItemBase from './ItemBase';

export default class PlayerInventory{
    items: Map<number,InventoryItem>;

    constructor(){
        this.items = new Map();
    }

    //TODO: Remember to update this to account for metadata when metadata is implemented
    addItem(base:ItemBase,amount:number){
        const existingItem:InventoryItem = this.items.get(base.id);

        if(!existingItem){
            existingItem.amount += amount;
        }
        else{
            this.items.set(base.id,new InventoryItem(base,amount));
        }
    }
}
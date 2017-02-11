import InventoryItem from './InventoryItem';
import Collection from '../../util/Collection';
import ItemBase from './ItemBase';

export interface DBItemBag{
    id:number;
    amount:number;
}

export default class PlayerInventory{
    items: Map<number,InventoryItem>;

    constructor(items?:Map<number,InventoryItem>){
        this.items = items || new Map();
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

    toDatabase():Array<DBItemBag>{
        const dbItems:Array<DBItemBag> = [];

        this.items.forEach((item)=>{
            dbItems.push({
                id: item.base.id,
                amount:item.amount
            });
        });

        return dbItems;
    }

    has(itemId:number,amount:number):boolean{
        const item = this.items.get(itemId);  

        if(item && item.amount >= amount){
            return true;
        }  

        return false;
    }
}
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

        if(existingItem){
            existingItem.amount += amount;
        }
        else{
            this.items.set(base.id,new InventoryItem(base,amount));
        }
    }

    removeItem(base:ItemBase,amount:number){
        const existingItem:InventoryItem = this.items.get(base.id);

        //Really these two checks should have already been run
        //but this may prevent a duping exploit
        if(!existingItem){
            throw 'Item not in inventory: '+base.id+' ('+base.title+') '+amount;
        }
        else if(amount > existingItem.amount){
            throw 'Only '+existingItem.amount+' of '+base.id+' ('+base.title+') in inventory, less than '+amount;
        }
        else if(amount == existingItem.amount){
            this.items.delete(base.id);
        }
        else{
            existingItem.amount = existingItem.amount - amount;
        }
    }

    toDatabase():Array<DBItemBag>{
        const dbItems:Array<DBItemBag> = [];

        this.items.forEach((item)=>{
            dbItems.push({
                id: item.base.id,
                amount: item.amount
            });
        });

        return dbItems;
    }

    clone():PlayerInventory{
        const itemsClone = new Map<number,InventoryItem>();

        this.items.forEach((item)=>{
            itemsClone.set(item.base.id,new InventoryItem(item.base,item.amount));
        });

        return new PlayerInventory(itemsClone);
    }
/*
    has(itemId:number,amount:number):boolean{
        const item = this.items.get(itemId);  

        if(item && item.amount >= amount){
            return true;
        }  

        return false;
    }*/


}
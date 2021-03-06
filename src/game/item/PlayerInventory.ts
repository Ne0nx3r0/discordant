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
    _addItem(base:ItemBase,amount:number){
        const existingItem:InventoryItem = this.items.get(base.id);

        if(existingItem){
            existingItem.amount += amount;
        }
        else{
            this.items.set(base.id,new InventoryItem(base,amount));
        }
    }

    _removeItem(base:ItemBase,amount:number){
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

    hasItem(item:ItemBase,amount?:number):boolean{
        if(!amount) amount = 1;

        const itemBase = this.items.get(item.id);
        
        if(itemBase){
            return amount >= amount;
        }

        return false;
    }

    getItemAmount(item:ItemBase){
        return this.items.get(item.id).amount;
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
}
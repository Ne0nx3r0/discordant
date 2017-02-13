import ItemBase from './ItemBase';
import ItemMetadata from './ItemMetadata';

export default class InventoryItem{
    base:ItemBase;
    amount:number;
    metadata:ItemMetadata;

    //TODO: implement item metadata here

    constructor(base:ItemBase,amount:number,metadata?:ItemMetadata){
        this.base = base;
        this.amount = amount;
        this.metadata = metadata;
    }
}
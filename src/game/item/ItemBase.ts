interface ItemBaseBag{
    id:number;
    title:string;
    description:string;
    hiddenDescription:string;
    hiddenDescriptionLoreNeeded:number;
}

export default class ItemBase{
    id:number;
    title:string;
    description:string;
    hiddenDescription:string;
    hiddenDescriptionLoreNeeded:number;
    
    constructor(bag:ItemBaseBag){
        this.id = bag.id;
        this.title = bag.title;
        this.description = bag.description;
        this.hiddenDescription = bag.hiddenDescription;
        this.hiddenDescriptionLoreNeeded = bag.hiddenDescriptionLoreNeeded;
    }
}
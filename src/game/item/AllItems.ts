import Weapons from './weapon/Weapons';
import ItemBase from './ItemBase';

export default class AllItems{
    items:Map<number,ItemBase>;

    constructor(){
        this.items = new Map();

        Weapons.forEach((weapon)=>{
            this.items.set(weapon.id,weapon);
        });
    }

    get(id:number):ItemBase{
        return this.items.get(id);
    }
}
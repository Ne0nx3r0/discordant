import ItemBase from './ItemBase';

import Weapon from './weapon/Weapon';
import * as WeaponsIndex from './weapon/WeaponsIndex';

export default class AllItems{
    items:Map<number,ItemBase>;

    constructor(){
        this.items = new Map();

        Object.keys(WeaponsIndex).forEach((weaponKey)=>{
            const weapon:Weapon = WeaponsIndex[weaponKey];
        
            this.items.set(weapon.id,weapon);
        });
    }

    get(id:number):ItemBase{
        return this.items.get(id);
    }
}
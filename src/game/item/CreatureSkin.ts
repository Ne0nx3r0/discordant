import ItemEquippable from './ItemEquippable';

export default class CreatureSkin extends ItemEquippable{
    constructor(id:number,title:string,description:string){
        super(id,title,description,'armor');
    }
}
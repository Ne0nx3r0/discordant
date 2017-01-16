import Attack from './Attack';

export default class Weapon{
    id:number;
    title:string;
    description:string;
    attacks:Array<Attack>;

    constructor(id:number,title:string,description:string,attacks:Array<Attack>){
        this.id = id;
        this.title = title;
        this.description = description;
        this.attacks = attacks;
    }
}
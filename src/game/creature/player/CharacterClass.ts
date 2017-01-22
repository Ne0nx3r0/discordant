import AttributeSet from '../AttributeSet';

export default class CharacterClass {
    id:number;
    title:string;
    description:string;
    startingAttributes:AttributeSet;

    constructor(id:number,title:string,description:string,startingAttributes:AttributeSet){
        this.id = id;
        this.title = title;
        this.description = description;
        this.startingAttributes = startingAttributes;
    }
}
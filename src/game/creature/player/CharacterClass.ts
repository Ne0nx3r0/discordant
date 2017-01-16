import AttributeSet from './AttributeSet';

export default class CharacterClass {
    id:number;
    title:string;
    description:string;
    attributes:AttributeSet;

    constructor(id,title,description,attributeSet){
        this.id = id;
        this.title = title;
        this.description = description;
        this.attributes = attributeSet;
    }
}
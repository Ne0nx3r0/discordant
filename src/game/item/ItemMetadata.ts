export default class ItemMetadata{
    _metadata:Map<string,string | number | boolean>;

    constructor(){
        this._metadata = new Map();
    }

    set(key:string,value:string | number | boolean){
        this._metadata.set(key,value);
    }

    get(key:string){
        return this._metadata.get(key);
    }

    toString(){
        const meta = Object.create(null);

        this._metadata.forEach(function(value,key){
            meta[key] = value;
        });

        return meta;
    }
}
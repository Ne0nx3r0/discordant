const TRIGGER_START_POINT = 2;

interface StartingPoint{
    x:number;
    y:number;
}

interface MapLayer{
    name:string;
    data:Array<number>;
}

interface MapData{
    layers:Array<MapLayer>;
    height:number;
    width:number;
    tileheight:number;
    tilewidth:number;
}

export default class{
    name:string;
    triggersLayer:number;
    mapData:MapData;

    constructor(name:string,mapData:MapData){
        this.name = name;
        this.mapData = mapData;
        
        for(var i=0;i<this.mapData.layers.length;i++){
            const layer = this.mapData.layers[i];

            if(layer.name == 'triggers'){
                this.triggersLayer = i;
                break; 
            }
        }

        if(this.triggersLayer === undefined){
            throw 'No trigger layer defined in map '+this.name;
        }
    }

    getMapSlicePath(x:number,y:number):string{
        return './assets/maps/'+this.name+'/slices/'+x+'-'+y+'.png';
    }

    getStartingPoint():StartingPoint{
        const triggerData = this.mapData.layers[this.triggersLayer].data;

        for(var i=0;i<triggerData.length;i++){
            if(triggerData[i] == TRIGGER_START_POINT){
                return {
                    x: i % this.mapData.width + 1,
                    y: Math.floor(i/this.mapData.width)+1,
                };
            }
        }

        throw 'Starting point not found for map '+this.name;
    }

    isWalkable(x,y):boolean{
        return this.mapData.layers[1].data[(y-1)*this.mapData.width+x-1] == 0;
    }
}
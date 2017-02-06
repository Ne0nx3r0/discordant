import ExplorableMap from '../map/ExplorableMap';
import EventDispatcher from '../../util/EventDispatcher';

export default class PartyExploringMap{
    map:ExplorableMap;
    currentX:number;
    currentY:number;
    _events:EventDispatcher;

    constructor(map:ExplorableMap){
        this.map = map;

        const startingPoint = map.getStartingPoint();

        this.currentX = startingPoint.x;
        this.currentY = startingPoint.y;
        
        this._events = new EventDispatcher();
    }

    getCurrentLocationImage(){
        return this.map.getMapSlicePath(this.currentX,this.currentY);
    }

    canMove(direction:PartyMoveDirection){
                if(direction == 'up') return this.map.isWalkable(this.currentX,this.currentY-1);
         else if(direction == 'down') return this.map.isWalkable(this.currentX,this.currentY+1);
         else if(direction == 'left') return this.map.isWalkable(this.currentX-1,this.currentY);
        else if(direction == 'right') return this.map.isWalkable(this.currentX+1,this.currentY);
    }

    move(direction:PartyMoveDirection){
        if(direction == 'up') this.currentY -= 1;
        else if(direction == 'down') this.currentY += 1;
        else if(direction == 'left') this.currentX -= 1;
        else if(direction == 'right') this.currentX += 1;
    }

    //Event methods
    on(event:PartyExploringMapEvent,handler:Function){ this._events.on(event,handler); }
    off(event:PartyExploringMapEvent,handler:Function){ this._events.off(event,handler); }
    dispatch<T>(event:PartyExploringMapEvent,eventData:T){ this._events.dispatch(event,eventData); }
}

enum PartyExploringMapEvent{
    
}

export {PartyExploringMapEvent};

type PartyMoveDirection = 'up' | 'left' | 'down' | 'right';

export {PartyMoveDirection}
import Logger from './Logger';

export default class EventDispatcher{
    _handlers:Array<Array<Function>>;

    constructor(){
        this._handlers = [];
    }

    on(eventType:number,handler:Function){
        if(!this._handlers[eventType]){
            this._handlers[eventType] = [];
        }

        this._handlers[eventType].push(handler);
    }

    off(eventType:number,handler:Function){
        const handlers = this._handlers[eventType];

        if(handlers){
            for(var i = handlers.length - 1; i >= 0; i--) {
                if(handlers[i] == handler) {
                    handlers.splice(i, 1);
                }
            }
        }
    }

    dispatch<T>(event:number,eventData:T){
        //is anyone even listening?
        if(this._handlers[event]){
            this._handlers[event].forEach(function(handler){
                try{
                    handler(eventData);
                }
                catch(ex){
                    Logger.error(ex);
                }
            });
        }
    }
}


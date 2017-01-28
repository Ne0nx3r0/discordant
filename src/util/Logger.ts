const winston = require('winston');

function randomString(len, charSet) {
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
}

class Logger{
    logger:any;

    constructor(){
      this.logger = new (winston.Logger)({
            transports: [
                new (winston.transports.Console)()
            ]
        });
 /* 
        const oldLogFunc = this.logger.log;

        this.logger.log = function() {
            var args = Array.prototype.slice.call(arguments, 0);

            if (args.length >= 2 && args[1] instanceof Error) {
                args[1] = args[1].stack;
            }

            return oldLogFunc.apply(this, args);
        };*/
    }

    makeId(){
        return new Date().getTime()+randomString(4,'derp');
    }

    log(level:string,ex){
        //If it's not an object make one and append it
        if(Object(ex) !== ex){
            ex = {msg:ex};
        }

        const derpId = this.makeId();

        this.logger.log(level,derpId,ex);

        return derpId;
    }

    error(ex):string{
        return this.log('error',ex);
    }

    warning(ex?):string{
        return this.log('warning',ex);
    }

    info(ex?):string{
        return this.log('info',ex);
    }
}

export default new Logger()
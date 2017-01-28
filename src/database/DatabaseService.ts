import PlayerCharacter from '../game/creature/player/PlayerCharacter';
const pg = require('pg');
const winston = require('winston');

interface getPlayerCharacterResult{
    error?:string;//A friendly error that can be handed to the user, logging handled by this class
    result?:any;//result rows
}

interface dbClientCallback{
    (error:any,result:any);
}

interface dbClient{
    query(query:string,params:Array<any>,callback:dbClientCallback):Function;
}

export default class DatabaseService{
    pool:any;

    constructor(dbConfig){
        this.pool = new pg.Pool(dbConfig);
    }

/* Usage:

    db.getPool().query('SELECT $1::text as name', ['brianc'], function (error, result) {
        if(error){
            //handle error
        }
        
        //use result
        //result.rows[0].name
    });
    
*/
    getPool():dbClient{
        return this.pool;
    }
}
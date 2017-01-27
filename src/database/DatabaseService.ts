import PlayerCharacter from '../game/creature/player/PlayerCharacter';
const pg = require('pg');

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

    getClient():dbClient{
        return this.pool;
    }
}


/* Usage:

    db.getClient().query('SELECT $1::text as name', ['brianc'], function (error, result) {
        if(error){
            //handle error
        }
        
        //use result
        //result.rows[0].name
    });
    
*/
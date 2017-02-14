import PlayerCharacter from '../game/creature/player/PlayerCharacter';
import Logger from '../util/Logger';

const pg = require('pg');

interface getPlayerCharacterResult{
    error?:string;//A friendly error that can be handed to the user, logging handled by this class
    result?:any;//result rows
}

interface batchQuery{
    query:string;
    params?:Array<any>;
}

interface dbClientCallback{
    (error:any,result:any);
}

interface dbClient{
    query(query:string,params:Array<any>,callback?:dbClientCallback);
}

export default class DatabaseService{
    pool:any;

    constructor(dbConfig){
        this.pool = new pg.Pool(dbConfig);

        //TODO: try using this
        //this.pool.connect();//connect to deter that initial lag


        const runBatch = this.runBatch;

        async();

        async function async(){
            try{
                const result = await runBatch([
                    { query:'SELECT 1;', params:['test'] },
                    { query:'SELECT 2;' },
                    { query:'SELECT 3' }
                ]);

                console.log('res',result);
            }
            catch(ex){
                console.log('it was',ex);
            }
        }
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

    runBatch(queries:Array<batchQuery>){
       // const pool = this.pool;
        const test = 42;

        async function async(){
            throw 'butt';
            return test;
        }

        return async();
        
        //https://github.com/brianc/node-postgres/wiki/Transactions

/*
            this.pool.query('BEGIN', function(err, result){
                if(err) return rollback(client,done);
            });

            client.query('BEGIN', function(err, result) {
            if(err) return rollback(client);
            client.query('INSERT INTO account(money) VALUES(100) WHERE id = $1', [1], function(err, result) {
                if(err) return rollback(client);
                client.query('INSERT INTO account(money) VALUES(-100) WHERE id = $1', [2], function(err, result) {
                    if(err) return rollback(client);
                    //disconnect after successful commit
                    client.query('COMMIT', client.end.bind(client));
                });
            });*/
    }
}

function batchRollback(client, done) {
    client.query('ROLLBACK', function(err) {
        //if there was a problem rolling back the query
        //something is seriously messed up.  Return the error
        //to the done function to close & remove this client from
        //the pool.  If you leave a client in the pool with an unaborted
        //transaction weird, hard to diagnose problems might happen.
        return done(err);
    });
};
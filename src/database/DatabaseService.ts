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

    //https://github.com/brianc/node-postgres/wiki/Transactions
    runBatch(queries:Array<batchQuery>){
        const pool = this.pool;

        return new Promise((resolve,reject)=>{
            try{
                pool.connect(function(err, client, done) {
                    if(err) throw err;

                    client.query('BEGIN', function(err) {
                        if(err){
                            const did = Logger.error(err);

                            reject('A DB error occurred '+did);

                            return batchRollback(client, done);
                        }
                        //as long as we do not call the `done` callback we can do 
                        //whatever we want...the client is ours until we call `done`
                        //on the flip side, if you do call `done` before either COMMIT or ROLLBACK
                        //what you are doing is returning a client back to the pool while it 
                        //is in the middle of a transaction.  
                        //Returning a client while its in the middle of a transaction
                        //will lead to weird & hard to diagnose errors.

                        nestedQuery(client,queries,done);
                    });
                });
            }
            catch(ex){
                const did = Logger.error(ex);

                reject('A DB error occurred '+did);
            }

            function nestedQuery(client,queries,done){
                const q = queries[0];
                const queriesSlice = queries.slice(1);

                client.query(q.query,q.params,function(err,result){
                    if(err){
                        const did = Logger.error(err);

                        reject('A DB error occurred '+did);

                        return batchRollback(client, done);
                    }

                    if(queriesSlice.length == 0){
                            client.query('COMMIT', done);

                            resolve(result);

                            return;
                    }

                    nestedQuery(client,queriesSlice,done);
                });
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
        });
    }
}
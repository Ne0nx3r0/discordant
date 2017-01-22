const pg = require('pg');

interface dbConfig{
    host:string;
    user:string;
    password:string;
    database:string;
    port?:number;
    maxClients?:number;
    timeout?:number;
}

export default class DatabaseService{
    pool:any;

    constructor(dbConfig:dbConfig){
        this.pool = new pg.Pool({
            user: dbConfig.user, //env var: PGUSER 
            database: dbConfig.database, //env var: PGDATABASE 
            password: dbConfig.password, //env var: PGPASSWORD 
            host: dbConfig.host, // Server hosting the postgres database 
            port: dbConfig.port||5432, //env var: PGPORT 
            max: dbConfig.maxClients||10, // max number of clients in the pool 
            idleTimeoutMillis: dbConfig.timeout||30000, // how long a client is allowed to remain idle before being closed
        });
    }

    getClient(){
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
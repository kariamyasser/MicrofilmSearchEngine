const sqlDb = require('mssql');
const settings = require('../settings');



//single pool

const pool = new sqlDb.ConnectionPool(settings.dbConfig);
pool.on('error', err => {
    if (err) {
        console.log('sql errors', err);
    }
    
});

pool.connect(err => {
    if (err) {
        console.log('failed to connect : ', err);
    }
    else{
        console.log('connected successfully');
    }
   
});


exports.execSql_singlePool = async function (sqlquery) {
    
    try {
       
        let result = await pool.request().query(sqlquery);
        return { success: result };
    } catch (err) {
        return { err: err };
    }
};

exports.closePool = function () {
    pool.close();
};
/* Calling pool.close() in execSql is not a good idea 
- once you close a pool, 
you can no longer acquire a connection from that pool. 
That means that all subsequent requests will fail.
The good idea is to export a close method and close the 
pool when you're absolutely sure there will be no
 more requests to make (e.g. when application closes). */
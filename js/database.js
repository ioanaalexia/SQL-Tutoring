const mysql = require('mysql2/promise');

    const connectionPromise = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'sql',
        database: 'myapp'
    });

const dbConnectionPromise = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sql',
    database: 'myapp2'
});


module.exports = {
    connectionPromise,
    dbConnectionPromise
}

const mysql = require('mysql2/promise');

// Creează conexiunea la baza de date ca o promisiune
    const connectionPromise = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'sql',
        database: 'myapp'
    });

// Creeaza conexiunea la baza de date cu tabelele pentru interogarile SQL 
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

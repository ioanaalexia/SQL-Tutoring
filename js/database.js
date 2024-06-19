const mysql = require('mysql2/promise');

// Creează conexiunea la baza de date ca o promisiune
const connectionPromise = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sql',
    database: 'myapp'
});

const connectionPromise2 = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sql',
    database: 'myapp2'
});


module.exports = connectionPromise;
module.exports = connectionPromise2;
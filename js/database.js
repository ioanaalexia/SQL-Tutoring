const mysql = require('mysql2/promise');

// Creează conexiunea la baza de date ca o promisiune
const connectionPromise = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sql',
    database: 'myapp'
});

module.exports = connectionPromise;

const mysql = require('mysql');

module.exports = function(){
    
    let mysqlConnection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'abhi@123',
        database: 'node_jwt'
    });
    return mysqlConnection
}

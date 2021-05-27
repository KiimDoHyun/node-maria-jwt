// 데이터베이스
var mysql = require('mysql');

var db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '1234',
    database: 'crud'
});

module.exports = db;
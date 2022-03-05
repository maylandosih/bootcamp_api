const mysql = require('mysql');
const util = require('util')

const db = mysql.createPool({
    host: "localhost",
    user: 'root',
    password: 'Mercibarn@0705',
    database: "dbbootcamp",
    port: 3306
})

const dbQuery = util.promisify(db.query).bind(db)

module.exports = { db, dbQuery }
"use strict";
const mysql = require('mysql');

module.exports = {
    joinRoom: joinRoom
};

const pool = mysql.createPool({
    connectionLimit: 10,
    host: '172.17.0.2',
    user: 'root',
    password: 'root',
    database: 'chatroom'
});

function joinRoom(user, callback) {
    pool.getConnection((err, conn) => {
        let params = {
            sql: 'INSERT INTO chatroom SET ?',
            values: user
        };

        conn.query(params, (err, results, fields) => {
            if(err) return callback(err);

            callback(null, results);

            conn.release();
        });
    });
}

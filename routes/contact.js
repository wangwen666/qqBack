var express = require('express');
var router = express.Router();

const mysql = require('mysql');

const dbConfig = require('./../db/config');
const userSQL = require('./../db/userSql');

const pool = mysql.createPool(dbConfig.mysql);

/* GET users listing. */

// 获取分组类型
router.get('/getGroup', function (req, res,next ) {
    pool.getConnection(function (err, connection) {

        if(err) {
            console.log('----err----');
            console.log(err);
            return;
        }

        const sql = "SELECT * FROM groups WHERE uid ='" + req.session.sessionId + "'";

        connection.query(sql, function (qerr, qres, result) {

            let data = {};

            if(qres){
                data.code = '200';
                data.msg = '成功';
                data.data = qres;
            }

            if(qerr){
                data.code = '500';
                data.msg = qerr;
                data.data = {};

            }

            res.json(data);

            // 释放链接
            connection.release();
        })

    })
})

// 获取分组详细信息

router.post('/getGroupDetail', function (req, res, next) {
    pool.getConnection(function (err, connection) {

        if(err) {
            console.log('----err----');
            console.log(err);
            return;
        }

        const sql = "SELECT * FROM friends WHERE pid ='" + req.session.sessionId + "' and gid = '" + req.body.id + "'";

        connection.query(sql, function (qerr, qres, result) {

            let data = {};

            if(qres){
                data.code = '200';
                data.msg = '成功';
                data.data = qres;
            }

            if(err){
                data.code = '500';
                data.msg = qerr;
                data.data = {};

            }

            res.json(data);

            // 释放链接
            connection.release();
        })

    })
})

module.exports = router;

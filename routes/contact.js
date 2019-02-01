var express = require('express');
var router = express.Router();

const mysql = require('mysql');

const dbConfig = require('./../db/config');
const userSQL = require('./../db/userSql');

const pool = mysql.createPool(dbConfig.mysql);

const responseJSON = (res, ret) => {
    if(typeof ret === 'undefined') {
        res.json({
            code: '-200',
            msg: '操作失败'
        });
    } else {
        res.json(ret);
    }
}


/* GET users listing. */

// 获取分组类型
router.get('/getGroup', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        const _res = res;

        if(err) {
            console.log('----err----');
            console.log(err);
            return;
        }

        const sql = "SELECT * FROM groups WHERE uid ='" + req.session.sessionId + "'";

        connection.query(sql, function (err, res, result) {

            let data = {};

            if(res){
                data.code = '200';
                data.msg = '成功';
                data.data = res;
            }

            if(err){
                data.code = '500';
                data.msg = '操作失败';
                data.data = err;

            }

            _res.json(data);

            // 释放链接
            connection.release();
        })

    })
})

// 获取分组详细信息

router.post('/getGroupDetail', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        const _res = res;

        if(err) {
            console.log('----err----');
            console.log(err);
            return;
        }

        console.log(req);

        const sql = "SELECT * FROM friends WHERE uid ='" + req.session.sessionId + "' and gid = '" + req.body.id + "'";

        console.log(sql);

        connection.query(sql, function (err, res, result) {

            let data = {};

            if(res){
                data.code = '200';
                data.msg = '成功';
                data.data = res;
            }

            if(err){
                data.code = '500';
                data.msg = '操作失败';
                data.data = err;

            }

            _res.json(data);

            // 释放链接
            connection.release();
        })

    })
})






module.exports = router;

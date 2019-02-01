var express = require('express');
var router = express.Router();

const mysql = require('mysql');

const dbConfig = require('./../db/config');
const userSQL = require('./../db/userSql');


const pool = mysql.createPool(dbConfig.mysql);

// 获取朋友列表
router.get('/getUserFriend', function (req, res, next) {

    pool.getConnection(function (err, connection) {
        if(err) {
            console.log('----err----');
            console.log(err);
            return;
        }
    })

    const str = 'SELECT * from group';

    connection.query(str, function (err, res, result) {
        if(res){
            console.log(res);
        }
    })

})

router.get('/info', function (req, res, next) {
    console.log('2222');
    pool.getConnection(function (err, connection) {

        if(err) {
            console.log('----err----');
            console.log(err);
            return;
        }

        const sql = 'SELECT * FROM group';


        connection.query(sql, function (err, res, result) {
            let isTrue = false;
            if(res){
                for(let i=0; i<res.length; i++){
                    isTrue = true;
                }
            }
            let data = {};
            if(isTrue){

                data.code = '200';
                data.msg = '成功';
                data.data = {}
            }

            if(err)
                data.err = err;
            responseJSON(_res, data);

            // 释放链接
            connection.release();
        })

    })
})

module.exports = router;

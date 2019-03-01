const express = require('express');
const router = express.Router();

const mysql = require('mysql');

const dbConfig = require('./../db/config');
const userSQL = require('./../db/userSql');

const pool = mysql.createPool(dbConfig.mysql);


router.post('/searchPeople', function(req, res, next){

    pool.getConnection(function (err, connection) {

        if(err) {
            console.log('----err----');
            console.log(err);
            return;
        }

        const sql = "SELECT * FROM info WHERE qq ='" + req.body.number + "'";

        connection.query(sql, function (qerr, qres, result) {

            let isTrue = false;
            let data = {};


            if(qerr) {
                data.code = '500';
                data.msg = qerr;
            }

            // 需要返回什么信息

            if(qres){
                for(let i = 0; i < qres.length; i++){
                    isTrue = true;
                }
            }

            if(isTrue){

                data.code = '200';
                data.msg = '成功';
                data.data = {}
            }

            res.json(data);

            // 释放链接
            connection.release();
        })

    })

})



module.exports = router;

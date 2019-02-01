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

// 用户登录
router.post('/login', function (req, res, next) {

    console.log('login');

    pool.getConnection(function (err, connection) {

        let param = req.body;
        const UserName = param.username;
        const Password = param.password;
        const _res = res;

        if(err){
            console.log('-------err----');
            console.log(err);
            return;
        }

        connection.query(userSQL.queryAll, function (err, res, result) {
            let isTrue = false;
            if(res){
                for(let i=0; i<res.length; i++){
                    if(res[i].username === UserName && res[i].password === Password){

                        req.session.sessionId = res[i].uid; // 登录成功，设置 session

                        console.log(res[i].uid);
                        console.log(req.session.sessionId);

                        isTrue = true;
                    }
                }
            }
            let data = {};
            data.isLogin = isTrue;
            if(isTrue){
                req.session.userName = req.body.username; // 登录成功，设置 session

                data.code = '200';
                data.msg = '登录成功';
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

// 用户注册

router.post('/register', function (req, res, next) {
    console.log('register');
    pool.getConnection(function (err, connection) {

        connection.query(userSQL.queryAll, function (err, res) {

            console.log(req.body);
            let param = req.body;
            const UserName = param.username;
            const Password = param.password;
            const _res = res;

            if (err) {
                console.log('[INSERT ERROR - ]', err.message);
                return;
            }

            let isTrue = false;
            if (res) {
                // 获取用户列表，循环遍历判断当前用户是否存在
                for (let i = 0; i < res.length; i++) {
                    if (res[i].username === UserName && res[i].password === Password) {
                        isTrue = true;
                    }
                }
            }

            let data = {};
            data.isreg = !isTrue;
            if (isTrue) {

                data.code = '500';
                data.msg = '用户已存在';
                data.data = {};

            } else {
                connection.query(userSQL.insert, [param.username, param.password], function (err, result) {
                    if (result) {
                        data.code = '200';
                        data.msg = '注册成功';
                        data.data = {};
                    } else {
                        data.code = '500';
                        data.msg = '注册失败';
                        data.data = {};
                    }
                })

            }

            if (err)
                data.err = err;

            // 以json形式，把操作结果返回给前台页面
            responseJSON(_res, data);

            // setTimeout(function () {
            //     responseJSON(_res, data)
            // }, 3000)

            connection.release();

        })

    })
})


router.get('/info', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        const _res = res;

        console.log('chufa');

        if(err) {
            console.log('----err----');
            console.log(err);
            return;
        }

        console.log(req.session);

        const sql = "SELECT * FROM info WHERE uid ='" + req.session.sessionId + "'";
        console.log(sql);

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

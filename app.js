var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require("express-session");
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var contactRouter = require('./routes/contact');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use(function(req, res, next) {

    console.log(req.cookies);
    console.log(req.cookies['connect.sid']);

    if (!req.cookies['connect.sid']) {
        console.log(req.url);
        if (req.url === '/user/login' || req.url === '/user/loginCheck') {
            next(); //如果请求的地址是登录则通过，进行下一个请求
        } else {
            // req.session.sessionId = ''; // 登录成功，设置 session

            // 返回信息 登录已过时
            res.json({
                code: '-200',
                msg: '请重新登录'
            });
        }
    } else if (req.cookies['connect.sid']) {
        next();
    }
})

app.use(session({
    secret :  'secret', // 对session id 相关的cookie 进行签名
    resave : true,
    saveUninitialized: false, // 是否保存未初始化的会话
    cookie : {
        maxAge : 1000 * 10 * 30, // 设置 session 的有效时间，单位毫秒
    },
}));

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/contact', contactRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



// let debug = require('debug')('my-application');
// app.set('port', process.env.PORT || 3000);
//
// // 启动监听
// const server = app.listen(app.get('port', function(){
//   debug('Express server listening on port'+server.address().port);
// }))

const port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log('Updated : Server listening at port %d', port);
});

// module.exports = app;

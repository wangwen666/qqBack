const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require("express-session");
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const contactRouter = require('./routes/contact');
const fileUpload = require('./routes/uploadFile');

const createServer = require('./ws');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public'))); // 静态资源的目录

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
app.use('/file', fileUpload);

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

const port = process.env.PORT || 3333;

app.listen(port, function () {
    console.log('Updated : Server listening at port %d', port);
});

createServer();



// module.exports = app;

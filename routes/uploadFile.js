const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const formidable = require('formidable');
const os = require('os');


router.post('/upload', function (req, res, next) {

    console.log("----");
    // console.log(os);
    console.log(os.tmpdir());

    console.log('----');

    const form = formidable.IncomingForm({
        encoding: 'utf-8',
        uploadDir: './public/files',
        keepExtensions: true,
        maxFieldsSize: 2 * 1024 * 1024
    });

    let allFile = [];
    form.on('progress', function (bytesReceived, bytesExpected) {

        const progressInfo = {
            value: bytesReceived,
            total: bytesExpected
        };

        console.log('dir: ' + form.uploadDir);

        console.log('progress: ' + JSON.stringify(progressInfo));
        res.write(JSON.stringify(progressInfo));

    })
        .on('file', function (filed, file) {
            allFile.push([filed, file])
        })
        .on('end', function () {
            res.end('上传成功 !');
        })
        .on('error', function (err) {
            console.log('上传失败', err.message);
        })
        .parse(req, function (err, fields, files) {
            if(err){
                console.log(err);
            }

            allFile.forEach(function (file, index) {
                const fieldName = file[0];
                const types = file[1].name.split('.');
                const date = new Date();
                const ms = Date.parse(date);
                fs.renameSync(file[1].path, form.uploadDir + '/' + types[0] + '.' + String(types[types.length - 1]));

            })
        })

})

router.get('/down', function (req, res, next) {
    console.log(process.cwd())
    // res.sendFile('/123.xlsx');
    res.sendFile(path.join(__dirname, '../public', '123.xlsx'));
    console.log(123444);

})

module.exports = router;


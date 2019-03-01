const ws = require('nodejs-websocket');
const createServer = () => {
    let server = ws.createServer(connection => {
        connection.on('text', function (res) {

            let info = JSON.parse(res);

            if (info.all) {
                broadcastALL(server, info);

            } else {
                broadcastSingle(server, info)

            }

        })

        connection.on('connect', function(code) {
            console.log('开启连接', code)
        })
        connection.on('close', function(code) {
            console.log('关闭连接', code)
        })

        connection.on('error', function(code) {
            // 某些情况如果客户端多次触发连接关闭，会导致connection.close()出现异常，这里try/catch一下
            try {
                connection.close()
            } catch (error) {
                console.log('close异常', error)
            }
            console.log('异常关闭', code)
        })
    }).listen(8001);

    server.on('close', () => {
        // chatUsers = []
    });
    return server
}



// 通知到所有用户
const broadcastALL= (server, info) => {

    server.connections.map((conn) => {

        if(conn.path === '/'+info.sid){
            conn.sendText(JSON.stringify(info));
        }
    })

}

// 通知到个人

const broadcastSingle = (server, info) => {

    server.connections.map((conn) => {

        if(conn.path === '/'+info.sid){
            conn.sendText(JSON.stringify(info));
        }
    })

}

module.exports = createServer;

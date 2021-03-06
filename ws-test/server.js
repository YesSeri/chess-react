const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 5000 });

wss.on('connection', function connection(ws) {
    console.log("connected");
    ws.on('message', function incoming(message) {
        const obj = JSON.parse(message)

        ws.send(JSON.stringify({ payload: obj.count+1 }));
    });
    // ws.send({ payload: 'sending a message' });
});
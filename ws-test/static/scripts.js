const button = document.querySelector("button")
let num = 0;
if ("WebSocket" in window) {

    // Let us open a web socket
    var ws = new WebSocket("ws://localhost:5000/");
    button.addEventListener('click', () => {
        ws.send(JSON.stringify({ count: num }));
    })
    // ws.onopen = function () {

    //     // Web Socket is connected, send data using send()
    //     ws.send({ payload: "Message to send" });
    // };

    ws.onmessage = function (e) {
        const received_msg = e.data;
        num = JSON.parse(received_msg).payload
        console.log(received_msg)
    };

    // ws.onclose = function () {

    // };
} else {

    // The browser doesn't support WebSocket
}
const button = document.querySelector("button")
let num = 0;
// Let us open a web socket
var ws = new WebSocket("ws://localhost:5000/");
button.addEventListener('click', () => {
    ws.send("aaa");
})
// ws.onopen = function () {

//     // Web Socket is connected, send data using send()
//     ws.send({ payload: "Message to send" });
// };

ws.onmessage = function (e) {
    const received_msg = e.data;
    console.log(received_msg)
};

    // ws.onclose = function () {

    // };
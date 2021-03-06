import React, { useEffect } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
// import Game from "./pages/Game";
import './App.css';
const client = new W3CWebSocket('ws://127.0.0.1:5000');

function App() {
  useEffect(() => {
    console.log("useeffect is run")
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    client.onmessage = (message) => {
      console.log(message);
    };
 
  }, []) 
  return (

      <div>
        Practical Intro To WebSockets.
      </div>
    // <Game />
  );
}


export default App;

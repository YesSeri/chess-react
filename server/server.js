const { v4: UniqID } = require('uuid');
const express = require('express')
const http = require('http')
const WebSocket = require('ws');
const { Chess } = require('chess.js')

const app = express();

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });
const teams = { white: [], black: [] }

const chess = new Chess()
// chess.move({ from: 'e2', to: 'e3', promotion: 'q'})
// console.log(chess.ascii())

// Everytime I send something I should have a payload and metadata in the object sent. 
wss.on('connection', (ws) => {
  // Adds a unique id to each client
  ws.id = UniqID();
  addToTeam(ws);
  ws.send(JSON.stringify({ subject: "greeting", metadata: new Date(), payload: { message: 'Welcome to the server, new client!' } }));
  ws.on('message', (message) => {
    const { subject, metadata, payload } = JSON.parse(message)
    // console.log(subject, metadata, payload)
    // console.log(subject)
    if (subject === 'joinedGame') {
      const joinGameMessage = createMessage('joinedGame', { color: ws.color })
      const updateBoardMessage = createMessage('updateBoard', { fen: chess.fen() })
      ws.send(joinGameMessage);
      ws.send(updateBoardMessage);
    } else if (subject === 'moveMade') {
      const move = chess.move(payload.move)
      const updateBoardMessage = createMessage('updateBoard', { fen: chess.fen() })
      wss.clients.forEach(client => {
        client.send(updateBoardMessage);
      })
    }
    else {
      console.log(`Hello, you sent -> ${message}`);
    }
  });
  ws.on('close', () => {
    removeFromTeam(ws)
  });
});

function createMessage(subject, payload, metadata = { time: new Date() }) {
  return JSON.stringify({ subject, payload, metadata })
}

function addToTeam(ws) {
  if (teams.white.length > teams.black.length) {
    teams.black.push(ws.id);
    ws.color = 'b'
  } else {
    teams.white.push(ws.id);
    ws.color = 'w'
  }
}
function removeFromTeam(ws) {
  for (team in teams) {
    const idx = team.indexOf(ws.id);
    if (idx !== -1) {
      array.splice(index, 1);
    }
  }
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server started on port ${server.address().port}.`);
});
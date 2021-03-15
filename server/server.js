const { v4: UniqID } = require('uuid');
const express = require('express')
const http = require('http')
const WebSocket = require('ws');
const { Chess } = require('chess.js')
const TEAM_SIZE = 1;

const app = express();
const getEngineMove = require('./chessEngine');
async function testEngine() {
  const c = new Chess();
  const m = await getEngineMove(c.fen(), 20);
  console.log(m);
}
testEngine()
//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });
const rooms = {};

class Room {
  constructor() {
    this.black = [];
    this.white = [];
    this.chess = new Chess('rnbqkbnr/ppppp2p/5p2/6p1/4P3/3P4/PPP2PPP/RNBQKBNR w KQkq - 0 3');
  }
  addPlayer(ws) {
    if (this.white.length > this.black.length) {
      this.black.push(ws);
      ws.player.color = 'b'
    } else {
      this.white.push(ws);
      ws.player.color = 'w'
    }
  }
  [Symbol.iterator]() {
    var index = -1;
    const arr = [...this.black, ...this.white];

    return {
      next: () => ({ value: arr[++index], done: !(index in arr) })
    };
  };
}
class Player {
  constructor() {
    this.id = UniqID();
    this.color;
    this.roomId;
  }
  setRoomId(id) {
    this.roomId = id;
  }
  setColor(color) {
    this.color = color;
  }
}
let waitingPlayers = [];

// Everytime I send something I should have a payload and metadata in the object sent. 
wss.on('connection', (ws) => {
  // Adds a unique id to each client
  ws.player = new Player();
  waitingPlayers.push(ws);
  // const greetMessage = createMessage('greeting', { message: 'Welcome to the server!' })
  // ws.send(greetMessage);
  if (waitingPlayers.length === TEAM_SIZE * 2) {
    const room = new Room();
    waitingPlayers.forEach(player => {
      room.addPlayer(player);
    })
    const id = UniqID();
    rooms[id] = room;
    setRoomIdForPlayers(id);
    startGame(id);
    waitingPlayers = [];
  } else {
    const waitMessage = createMessage('waiting', { message: 'Waiting for other player/players to join.' })
    ws.send(waitMessage);
  }
  ws.on('message', (message) => {
    const { subject, metadata, payload } = JSON.parse(message)

    if (subject === 'moveMade') {
      const room = rooms[ws.player.roomId];
      const move = room.chess.move(payload.move)
      if (move) {
        for (const ws of room) {
          const updateBoardMessage = createMessage('updateBoard', { fen: room.chess.fen() })
          ws.send(updateBoardMessage);
        }
      }
      if (room.chess.game_over()) {
        console.log("GAME OVER")
        for (const ws of room) {
          const updateBoardMessage = createMessage('gameOver', { winner: room.chess.turn() })
          ws.send(updateBoardMessage);
        }
      }
    }

    else {
      console.log(`Hello, you sent -> ${message}`);
    }
  });
  ws.on('close', () => {
    waitingPlayers = waitingPlayers.filter(el => el.player.id !== ws.player.id);
    // removeFromTeam(ws)
  });
});

function setRoomIdForPlayers(id) {
  const room = rooms[id]
  for (const ws of room) {
    ws.player.setRoomId(id);
  }
}
function startGame(id) {
  const room = rooms[id]
  for (const ws of room) {
    const joinGameMessage = createMessage('joinedGame', { color: ws.player.color })
    const updateBoardMessage = createMessage('updateBoard', { fen: room.chess.fen() })
    ws.send(joinGameMessage);
    ws.send(updateBoardMessage);
  }

}
function createMessage(subject, payload, metadata = { time: new Date() }) {
  return JSON.stringify({ subject, payload, metadata })
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
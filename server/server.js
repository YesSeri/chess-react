(async () => {

  const { v4: UniqID } = require('uuid');
  const express = require('express')
  const http = require('http')
  const WebSocket = require('ws');
  const TEAM_SIZE = 1;

  const app = express();
  const { getEngine, startEngine } = require('./chessEngine');
  const { Room, Player } = require('./classes');
  const { getMoves } = require('./getMoves');
  //initialize a simple http server


  const path = require('path');
  const enginePath = path.join(__dirname, '..', 'stockfish_13_win_x64_avx2.exe');

  const engine = getEngine(enginePath);
  await startEngine(engine);
  const server = http.createServer(app);

  //initialize the WebSocket server instance
  const wss = new WebSocket.Server({ server });
  const rooms = {};

  let waitingPlayers = [];

  // Everytime I send something I should have a payload and metadata in the object sent. 
  wss.on('connection', async (ws) => {
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
    ws.on('message', async (message) => {
      const { subject, metadata, payload } = JSON.parse(message)
      console.log(subject, metadata, payload, Object.keys(rooms).length);

      if (subject === 'moveMade') {
        const room = rooms[ws.player.roomId];
        if (payload.move === null) {
          return
        }
        const move = room.board.move(payload.move)
        if (move) {
          const threeMoves = await getMoves(room.board, engine);
          for (const ws of room) {
            const updateBoardMessage = createMessage('updateBoard', { fen: room.board.fen(), threeMoves})
            ws.send(updateBoardMessage);
          }
        }
        if (room.board.game_over()) {
          console.log("GAME OVER")
          for (const ws of room) {
            const updateBoardMessage = createMessage('gameOver', { winner: room.board.turn() })
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
      const updateBoardMessage = createMessage('updateBoard', { fen: room.board.fen() })
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
})();
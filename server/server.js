(async () => {

  const startFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

  const { v4: UniqID } = require('uuid');
  const express = require('express')
  const http = require('http')
  const WebSocket = require('ws');
  const { Chess } = require('chess.js')
  const TEAM_SIZE = 1;

  const app = express();
  const { getEngineMove, quitEngine, startEngine } = require('./chessEngine');
  //initialize a simple http server
  await startEngine();
  const server = http.createServer(app);

  //initialize the WebSocket server instance
  const wss = new WebSocket.Server({ server });
  const rooms = {};

  class Room {
    constructor() {
      this.black = [];
      this.white = [];
      this.board = new Chess();
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
  wss.on('connection', async (ws) => {
    // Adds a unique id to each client

    const move = await getEngineMove(startFEN)
    console.log(move);
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
        const move = room.board.move(payload.move)
        if (move) {
          const moves = getMoves(room.board);
          for (const ws of room) {
            const updateBoardMessage = createMessage('updateBoard', { fen: room.board.fen() })
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
      // removeFromTeam(ws)
    });
  });

  async function getMoves(board) {
    let goodMove = await getEngineMove(board.fen(), engine, 3)
    const bestMove = await getEngineMove(board.fen(), engine)
    if (goodMove === bestMove) {
      goodMove = getRandomMove(board);
    }
    const randomMove = getRandomMove(board);
    console.log("moves", bestMove, goodMove, randomMove);
    return { goodMove, bestMove, randomMove }
  }

  function getRandomMove(board) {

    const moves = board.moves();
    return moves[Math.floor(Math.random() * moves.length)];
  }

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
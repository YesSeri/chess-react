const { Chess } = require('chess.js')
const { v4: UniqID } = require('uuid');

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

module.exports = { Room, Player }
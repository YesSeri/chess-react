const { v4: UniqID } = require('uuid');


const rooms = {};
class Room {
    constructor() {
        this.black = [];
        this.white = [];
        this.isStarted = false;
    }
    addPlayer(player) {
        if (this.white.length > this.black.length) {
            this.black.push(player.id);
            player.color = 'b'
        } else {
            this.white.push(player.id);
            player.color = 'w'
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

    set roomId(id){
        roomId = id;
    }
}

const player = new Player();
const player2 = new Player();
const player3 = new Player();
const player4 = new Player();
console.log(player + "");
// console.log(player2);
// console.log(player3);
// console.log(player4);
const room = new Room();
const room2 = new Room();
room.addPlayer(player);
room.addPlayer(player2);
rooms[12] = room;
// console.log(rooms);
// for (const p of room) {
//     console.log(player)
// }
const express = require('express')
const http = require('http')
const stockfish = require('stockfish')

const { Worker, isMainThread, parentPort } = require('worker_threads');

const app = express();

//initialize a simple http server
const server = http.createServer(app);

// var stockfish = new Worker("stockfish.js");
// console.log(stockfish.sendMessage());
var a = STOCKFISH();

//start our server
// server.listen(process.env.PORT || 5000, () => {
//     console.log(`Server started on port ${server.address().port} :)`);
// });
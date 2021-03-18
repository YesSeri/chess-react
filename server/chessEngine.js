var path = require('path');
const Engine = require('node-uci').Engine

// const promotionFEN = '4k3/P7/8/8/8/8/8/4K3 w - - 0 1';
const startFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
// const evenMidFEN = '2r1k2r/pp1qbp2/4p1p1/1P1pPn1p/P1pP4/2P2PP1/4QB1P/1R1R1NK1 b k - 0 26';
const p = path.join(__dirname, '..', 'stockfish_13_win_x64_avx2.exe');
const engine = new Engine(p)
async function getEngineMove(fen, depth = 15) {
    const e = await startEngine();
    console.log(e)
    await e.position(fen)
    const result = await e.go({ depth })
    return await parse_move(result.bestmove)
}
async function startEngine() {
    if (engine.id.name === null) {
        await engine.init()
        await engine.setoption('MultiPV', '4')
        await engine.isready()
    }
    return engine;
}
async function quitEngine() {
    const e = await startEngine();
    await e.quit()
}

function parse_move(string) {
    const from = string.substring(0, 2)
    const to = string.substring(2, 4)
    const promotion = string.substring(4, 5)
    const move = { from, to, promotion }
    return move;
}


// console.time();
// console.timeEnd();
async function test() {
    await getEngineMove(startFEN).then(move => console.log(move))
    await quitEngine();

}
test()
module.exports = getEngineMove;
// module.exports = getEngine;
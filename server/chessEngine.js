var path = require('path');
const Engine = require('node-uci').Engine

// const promotionFEN = '4k3/P7/8/8/8/8/8/4K3 w - - 0 1';
// If I want to run a position two times, with different depths, then I need to run the one with the lower depth first, because else the engine remembers the better evaluation and returns that. 
const startFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const evenMidFEN = '2r1k2r/pp1qbp2/4p1p1/1P1pPn1p/P1pP4/2P2PP1/4QB1P/1R1R1NK1 b k - 0 26';
const p = path.join(__dirname, '..', 'stockfish_13_win_x64_avx2.exe');
async function getEngineMove(fen, engine = startEngine(), depth = 15) {
    await engine.position(fen)
    const result = await engine.go({ depth })
    const color = fen.split(" ")[1]
    const move = {color, ...parseMove(result.bestmove)}
    return move
}
async function startEngine(engine) {
    if (engine.id.name === null) {
        await engine.init()
        await engine.setoption('MultiPV', '4')
        await engine.isready()
    }
    return engine;
}

function parseMove(string) {
    const from = string.substring(0, 2)
    const to = string.substring(2, 4)
    const promotion = string.substring(4, 5)
    const move = { from, to, promotion }
    return move;
}
function getEngine(path) {
    return new Engine(path);
}

module.exports = { getEngineMove, getEngine, startEngine, enginePath: p };
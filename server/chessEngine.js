var path = require('path');
const Engine = require('node-uci').Engine

// const promotionFEN = '4k3/P7/8/8/8/8/8/4K3 w - - 0 1';
// const startFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
// const evenMidFEN = '2r1k2r/pp1qbp2/4p1p1/1P1pPn1p/P1pP4/2P2PP1/4QB1P/1R1R1NK1 b k - 0 26';
async function getEngineMove(fen, depth=15) {
    const p = path.join(__dirname, '..', 'stockfish_13_win_x64_avx2.exe');
    const engine = new Engine(p)
    await engine.init()
    await engine.setoption('MultiPV', '4')
    await engine.isready()
    await engine.position(fen)
    const result = await engine.go({ depth })
    await engine.quit()
    return await parse_move(result.bestmove)
}

function parse_move(string) {
    const from = string.substring(0, 2)
    const to = string.substring(2, 4)
    const promotion = string.substring(4, 5)
    const move = { from, to, promotion }
    return move;
}
module.exports = getEngineMove;
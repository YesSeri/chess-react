var path = require('path');

const promotionFEN = '4k3/P7/8/8/8/8/8/4K3 w - - 0 1';
const startFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const evenMidFEN = '2r1k2r/pp1qbp2/4p1p1/1P1pPn1p/P1pP4/2P2PP1/4QB1P/1R1R1NK1 b k - 0 26';
async function get_best_move(fen) {
    const Engine = require('node-uci').Engine
    const p = path.join(__dirname, '..', 'stockfish_13_win_x64_avx2.exe');
    const engine = new Engine(p)
    await engine.init()
    await engine.setoption('MultiPV', '4')
    await engine.isready()
    await engine.position(evenMidFEN)
    console.log('engine ready', engine.id, engine.options)
    const result = await engine.go({ depth: 15 })
    await engine.quit()
    const parsedMove = await parse_move(result.bestmove)
    return parsedMove
}

function parse_move(string){
    const from = string.substring(0, 2)
    const to = string.substring(2, 4)
    const promotion = string.substring(4, 5)
    const move = {from, to, promotion}
    return move;
}
// test_engine();

get_best_move().then(bestMove => console.log(bestMove))


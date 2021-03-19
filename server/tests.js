(async () => {

    const { getEngineMove, getEngine, startEngine } = require('./chessEngine');
    const { Chess } = require('chess.js')
    const path = require('path');
    const enginePath = path.join(__dirname, '..', 'stockfish_13_win_x64_avx2.exe');

    const engine = getEngine(enginePath);
    await startEngine(engine);
    // The lower depth eval must be run first, else the engine remembers the better evaluation. 
    async function getMoves(board) {
        const goodMove = await getEngineMove(board.fen(), engine, 3)
        const bestMove = await getEngineMove(board.fen(), engine)
        const randomMove = getRandomMove(board);
        console.log("moves", bestMove, goodMove, randomMove);
    }
    function getRandomMove(board) {
        const moves = board.moves();
        return moves[Math.floor(Math.random()*moves.length)];
    }

    const evenMidFEN = 'r1b2r2/bnq2pkn/2pp4/p3pP2/P1N1P2B/2PP4/4B1PP/R2Q1R1K b - - 0 21';
const promotionFEN = '7k/P7/8/8/8/8/8/7K b - - 0 1';
    const b = new Chess(evenMidFEN);
    await getMoves(b);
    await engine.quit();
})();
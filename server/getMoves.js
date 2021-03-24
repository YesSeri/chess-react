const { getEngineMove } = require('./chessEngine');

// The lower depth eval must be run first, else the engine remembers the better evaluation. 
async function getMoves(board, engine) {

    const goodMove = await getEngineMove(board.fen(), engine, 5)
    const bestMove = await getEngineMove(board.fen(), engine)

    const availableMoves = board.moves({ verbose: true }).filter(move => {
        if (goodMove.from === move.from && goodMove.to === move.to || bestMove.from === move.from && bestMove.to === move.to) {
            return false;
        }
        return true;
    })

    if (goodMove.to === bestMove.to && goodMove.from === bestMove.from) {
        if (availableMoves.length === 0) {
            return { bestMove, goodMove: null, randomMove: null }
        } else if (availableMoves.length > 1) {
            const move1 = getRandomMove(availableMoves);
            const remainingMoves = availableMoves.filter(move => {
                if (move1.from === move.from && move1.to === move.to) {
                    return false;
                }
                return true;
            })
            const move2 = getRandomMove(remainingMoves);

            return { bestMove, goodMove: move1, randomMove: move2 }
        } else {
            return { bestMove, goodMove: getRandomMove(board), randomMove: null }
        }
    } else {
        if (availableMoves.length === 0) {
            return { bestMove, goodMove, randomMove: null }
        } else {
            return { bestMove, goodMove, randomMove: getRandomMove(availableMoves) }
        }
    }
}

function getRandomMove(moves) {
    return moves[Math.floor(Math.random() * moves.length)];
}

module.exports = { getMoves };
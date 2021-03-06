import React, { useState } from 'react'
import { Chessboard } from '../components'
import Chess from 'chess.js'

export function ChessContainer() {
	const [board] = useState(new Chess('1nbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'))
	const [fromSquare, setFromSquare] = useState(null);
	const [turn, setTurn] = useState(false);



	const handleClick = (coordinate) => {
		if (turn) {
			if (!fromSquare) {
				setFromSquare(coordinate)
			} else {
				board.move({ from: fromSquare, to: coordinate, promotion: 'q' })
				setFromSquare(null);
			}
		}
	}
	return (
		<Chessboard.Container>
			<Chessboard board={board.board()} handleClick={handleClick} />
		</Chessboard.Container>
	)
}

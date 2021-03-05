import React, { useState } from 'react'
import { Chessboard } from '../components'
import Chess from 'chess.js'

export function ChessContainer() {
	const [board, setBoard] = useState(new Chess('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'))
	const [fromSquare, setFromSquare] = useState(null);
	const [toSquare, setToSquare] = useState(null);
	const handleClick = (piece, coordinate) => {
		if (!fromSquare) {
			setFromSquare(coordinate)
		} else {
			setToSquare(coordinate)
		}
	}
	const VisualLog = () => {
		return(<div style={{ fontSize: '48px' }}>
			{fromSquare !== null ? <div>{fromSquare} </div> : <div>"null"</div>}
			{toSquare !== null ? <div>{toSquare} </div> : <div>"null"</div>}
		</div>)
	}
	return (
		<Chessboard.Container>
			<Chessboard board={board.board()} handleClick={handleClick}>
			</Chessboard>
			<VisualLog></VisualLog>
		</Chessboard.Container>
	)
}

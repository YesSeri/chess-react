import React, { useEffect, useState } from 'react'
import { Chessboard } from '../components'
import Chess from 'chess.js'

const socket = new WebSocket('ws://localhost:5000/')

export function ChessContainer() {
	// const [board] = useState(new Chess('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'))
	const [board, setBoard] = useState(new Chess('8/8/8/8/8/8/8/8 w - - 0 1'))
	const [fromSquare, setFromSquare] = useState(null);
	const [turn, setTurn] = useState(false);
	useEffect(() => {
		socket.onopen = () => {
			socket.send("joinedGame");
		};
		socket.onmessage = ({ data }) => {
			const parsedData = JSON.parse(data)
			if (parsedData.subject === 'fetchedCurrentBoard') {
				setBoard(new Chess(parsedData.payload.fen))
			}
		};

	}, [])
	useEffect(() => { setTurn(board.turn()) }, [board])
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

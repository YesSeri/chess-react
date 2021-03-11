import React, { useEffect, useState } from 'react'
import { Chessboard } from '../components'
import Chess from 'chess.js'

const socket = new WebSocket('ws://localhost:5000/')

export function ChessContainer() {
	// const [board] = useState(new Chess('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'))
	const [board, setBoard] = useState(new Chess('8/8/8/8/8/8/8/8 w - - 0 1'))
	const [fromSquare, setFromSquare] = useState(null);
	const [color, setColor] = useState(null);
	useEffect(() => {
		socket.onopen = () => {
			const joinGameMessage = createMessage("joinedGame", null)
			socket.send(joinGameMessage);
		};
		socket.onmessage = ({ data }) => {
			const { subject, metadata, payload } = JSON.parse(data);
			// console.log(subject, metadata, payload);
			if (subject === 'joinedGame') {
				console.log(payload.color)
				setColor(payload.color);
			} else if (subject === 'updateBoard') {
				setBoard(new Chess(payload.fen));
			}
		};

	}, [])
	const handleClick = (coordinate) => {
		if (color === board.turn()) {
			if (!fromSquare) {
				setFromSquare(coordinate)
			} else {
				const move = board.move({ from: fromSquare, to: coordinate, promotion: 'q' })
				const moveMessage = createMessage('moveMade', { move })
				socket.send(moveMessage)
				setFromSquare(null);
			}
		}
	}
	return (
		<Chessboard.Container>
			<Chessboard board={board.board()} handleClick={handleClick} />
			{color ? <div style={{ fontSize: '50px' }}>{color}</div> : null}
		</Chessboard.Container>
	)
}

function createMessage(subject, payload, metadata = { time: new Date() }) {
	return JSON.stringify({ subject, payload, metadata })
}
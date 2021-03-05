import React from 'react'
import { Container, Board, Row, Square } from './styles/chessboard'

import {
    blackBishop,
    blackKing,
    blackKnight,
    blackPawn,
    blackQueen,
    blackRook,
    emptySquare,
    whiteBishop,
    whiteKing,
    whiteKnight,
    whitePawn,
    whiteQueen,
    whiteRook,
} from './styles/pieces'

// Board is 8 arrays with 8 values in each. null is empty square. 
export default function Chessboard({ board, children, ...restProps }) {
    return (
        <Board>
            {board.map((row, rowIdx) => {
                return (
                    <Chessboard.Row key={rowIdx}>
                        {row.map((square, colIdx) => {
                            const coordinate = pointToSquareNotation(colIdx, rowIdx)
                            console.log(coordinate);
                            return <Chessboard.Square coordinate={coordinate} {...restProps} square={square} key={colIdx}></Chessboard.Square>
                        })}
                    </Chessboard.Row>
                )
            })}
        </Board>
    )
}

Chessboard.Container = function ChessBoard({ children, ...restProps }) {
    return (
        <Container>
            {/* <Inner> */}
            {children}
            {/* </Inner> */}
        </Container>
    )
}
Chessboard.Row = function ChessRow({ children, ...restProps }) {
    return <Row {...restProps}>{children}</Row>
}
Chessboard.Square = function ChessSquare({ square, handleClick, coordinate, ...restProps }) {
    const src = getSVG(square);
    return (
        <Square src={src} onClick={() => handleClick(square, coordinate)} {...restProps}></Square>
    )

}

function pointToSquareNotation(x, y) {
    const coordinate = { col: x, row: 7 - y };
    if (x === 0) {
        return "a" + (7 - y);
    } else if (x === 1) {
        return "b" + (7 - y);
    } else if (x === 2) {
        return "c" + (7 - y);
    } else if (x === 3) {
        return "d" + (7 - y);
    } else if (x === 4) {
        return "e" + (7 - y);
    } else if (x === 5) {
        return "f" + (7 - y);
    } else if (x === 6) {
        return "g" + (7 - y);
    } else {
        return "h" + (7 - y);
    }

}
function getSVG(square) {
    if (square === null) {
        return emptySquare;
    } else {
        switch (square.type) {
            case "r":
                return square.color === "b" ? blackRook : whiteRook
            case "n":
                return square.color === "b" ? blackKnight : whiteKnight
            case "b":
                return square.color === "b" ? blackBishop : whiteBishop
            case "q":
                return square.color === "b" ? blackQueen : whiteQueen
            case "k":
                return square.color === "b" ? blackKing : whiteKing
            case "p":
                return square.color === "b" ? blackPawn : whitePawn
            default:
                return <span></span>
        }
    }
}
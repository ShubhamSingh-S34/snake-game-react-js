import React, { useState } from 'react'
import './Board.css'




function Board() {

    const boardSize = 12

    const createBoard = (boardSize) => {
        let board = [];
        let counter = 1;
        for (let i = 0; i < boardSize; i++) {
            let row = [];
            for (let j = 0; j < boardSize; j++) {
                row.push(counter);
                counter++;
            }
            board.push(row);
        }
        return board;
    }
    const [board, setBoard] = useState(createBoard(boardSize))
    const [score, setScore] = useState(0);
    return (
        <>
            <div className='boardContainer'>
                <div className='score'>{score}</div>
                <div className='board'>
                    {board.map((row, rowInd) => {
                        return (
                            <div key={rowInd} className='row'>
                                {row.map((element, index) => {
                                    return (<div key={index} className='cell'></div>)
                                })}
                            </div>
                        )
                    })}
                </div>
            </div >
        </>
    )



}

export default Board
import React, { useEffect, useRef, useState } from 'react'
import './Board.css'
import { useInterval } from '../hooks/useInterval'



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
    const getValueFromCoordinates = ({ x, y }) => {
        return (boardSize * (x - 1) + y);
    }
    const getCoordsInDirection = (coords, direction) => {
        if (direction === "UP") {
            return {
                x: coords.x - 1,
                y: coords.y,
            };
        }
        if (direction === "RIGHT") {
            return {
                x: coords.x,
                y: coords.y + 1,
            };
        }
        if (direction === "DOWN") {
            return {
                x: coords.x + 1,
                y: coords.y,
            };
        }
        if (direction === "LEFT") {
            return {
                x: coords.x,
                y: coords.y - 1,
            };
        }
    };

    const moveSnake = () => {
        // next head coordinates 
        const tailOfSnakeCoords = snakeArr[snakeArr.length - 1];
        const nextHeadCoords = getCoordsInDirection(snakeArr[0], direction);
        // move snake array to next head coordinates
        console.log(direction);
        const tailValue = getValueFromCoordinates(tailOfSnakeCoords);
        const nextHeadValue = getValueFromCoordinates(nextHeadCoords);
        const newSnakeSet = new Set([...snakeSet]);
        newSnakeSet.delete(tailValue);
        newSnakeSet.add(nextHeadValue);
        setSnakeSet(newSnakeSet);
        let newSnakeArr = [...snakeArr];
        newSnakeArr[0] = nextHeadCoords;
        setSnakeArr(newSnakeArr);
    }
    const [board, setBoard] = useState(createBoard(boardSize))
    const [score, setScore] = useState(0);
    const [snakeArr, setSnakeArr] = useState([{ x: 5, y: 3 }]);
    const [snakeSet, setSnakeSet] = useState(new Set([getValueFromCoordinates(snakeArr[0])]));
    const [direction, setDirection] = useState("RIGHT")
    const [pause, setPause] = useState(false);
    useEffect(() => {
        // console.log(direction, "First Render");
        window.addEventListener("keydown", (e) => {
            if (e.key === 'ArrowUp') setDirection("UP")
            if (e.key === 'ArrowRight') setDirection("RIGHT")
            if (e.key === 'ArrowDown') setDirection("DOWN")
            if (e.key === 'ArrowLeft') setDirection("LEFT")
            console.log(direction);
        })

    }, [])

    useInterval(() => {
        if (!pause) {
            moveSnake();
        }
    }, 500);
    return (
        <>
            <div className='boardContainer'>
                <div className='upperPart'>
                    <div className='score'>{score}</div>
                    <div className='buttonContainer'>
                        <button
                            onClick={() => { setPause((prevState) => !prevState) }}
                            className='button'
                        >
                            {!pause ? "pause" : "start"}
                        </button>
                    </div>
                </div>

                <div className='board'>
                    {board.map((row, rowInd) => {
                        return (
                            <div key={rowInd} className='row'>
                                {row.map((element, index) => {
                                    return (<div key={index} className={snakeSet.has(element) ? 'cell cell-red' : 'cell'}>

                                    </div>)
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
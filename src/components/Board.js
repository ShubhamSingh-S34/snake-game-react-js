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
    const isOutOfBounds = (coords, board) => {
        const { x, y } = coords;
        if (x < 0 || y < 0) return true;
        if (x > board.length || y > board[0].length) return true;
        return false;
    };
    const moveSnake = () => {
        // next head coordinates 
        const tailOfSnakeCoords = snakeArr[snakeArr.length - 1];
        const nextHeadCoords = getCoordsInDirection(snakeArr[0], direction);
        if (isOutOfBounds(nextHeadCoords, board)) {
            setGameOver(true);
            return;
        }
        // move snake array to next head coordinates
        const tailValue = getValueFromCoordinates(tailOfSnakeCoords);
        const nextHeadValue = getValueFromCoordinates(nextHeadCoords);
        const newSnakeSet = new Set([...snakeSet]);
        newSnakeSet.delete(tailValue);
        newSnakeSet.add(nextHeadValue);
        setSnakeSet(newSnakeSet);

        const newSnakeArr = [nextHeadCoords, ...snakeArr];
        newSnakeArr.pop();
        setSnakeArr(newSnakeArr);
        console.log(snakeArr);
    }
    const [board, setBoard] = useState(createBoard(boardSize))
    const [score, setScore] = useState(0);
    const [snakeArr, setSnakeArr] = useState([{ x: 5, y: 3 }, { x: 5, y: 2 }, { x: 5, y: 1 }]);
    const [snakeSet, setSnakeSet] = useState(new Set([51, 50, 49]));
    const [direction, setDirection] = useState("RIGHT")
    const [pause, setPause] = useState(false);
    const [gameOver, setGameOver] = useState(false);
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
    if (gameOver) {
        return (
            <div>
                <p>Game-Over Bitch!</p>
                <button className='button' onClick={() => {
                    setGameOver(false);
                    setBoard(createBoard(boardSize));
                    setScore(0);
                    setSnakeArr([{ x: 5, y: 3 }, { x: 5, y: 2 }, { x: 5, y: 1 }]);
                    setDirection("RIGHT");
                    setSnakeSet(new Set([51, 50, 49]));
                }}>Restart</button>
            </div>
        )
    }
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
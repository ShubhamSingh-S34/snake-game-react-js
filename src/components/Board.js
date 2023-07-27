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
        if (x <= 0 || y <= 0) return true;
        if (x > board.length || y > board[0].length) return true;
        return false;
    };
    const generateFoodCells = (min, max) => {
        const foodCell = {
            x: Math.floor(Math.random() * (max - min + 1) + min),
            y: Math.floor(Math.random() * (max - min + 1) + min)
        }
        const foodCellValue = getValueFromCoordinates(foodCell);
        if (snakeSet.has(foodCellValue)) {
            return generateFoodCells(min, max);
        }
        else return foodCell
    }
    const handleGameOver = (message) => {
        setGameOverMessage(message);
        setGameOver(true);
        return;
    }
    const moveSnake = () => {
        // next head coordinates 
        const tailOfSnakeCoords = snakeArr[snakeArr.length - 1];
        const nextHeadCoords = getCoordsInDirection(snakeArr[0], direction);
        const nextHeadValue = getValueFromCoordinates(nextHeadCoords);
        if (isOutOfBounds(nextHeadCoords, board)) {
            handleGameOver("OOPS !!! You Went Outside the boundary");
            return;
        }
        if (snakeSet.has(nextHeadValue)) {
            handleGameOver("STUPID !!! You ate Yourself ");
            return;
        }
        if (nextHeadCoords.x == foodCell.x && nextHeadCoords.y == foodCell.y) {
            // Grow Snake
            setScore((score) => score + 10);
            const newSnakeSet = new Set([...snakeSet]);
            newSnakeSet.add(nextHeadValue);
            setSnakeSet(newSnakeSet);
            const newSnakeArr = [nextHeadCoords, ...snakeArr];
            setSnakeArr(newSnakeArr);
            setFoodCell(generateFoodCells(1, boardSize))
            return;
        }
        // move snake array to next head coordinates
        const tailValue = getValueFromCoordinates(tailOfSnakeCoords);

        const newSnakeSet = new Set([...snakeSet]);
        newSnakeSet.delete(tailValue);
        newSnakeSet.add(nextHeadValue);
        setSnakeSet(newSnakeSet);

        const newSnakeArr = [nextHeadCoords, ...snakeArr];
        newSnakeArr.pop();
        setSnakeArr(newSnakeArr);
    }
    const handleDirectionChange = (e) => {
        // console.log("direction Ref -> ", directionRef);
        if (e.key === 'ArrowUp' && directionRef.current != "DOWN") {
            setDirection("UP");
            directionRef.current = "UP";
        }
        if (e.key === 'ArrowRight' && directionRef.current != "LEFT") {
            setDirection("RIGHT");
            directionRef.current = "RIGHT";
        }
        if (e.key === 'ArrowDown' && directionRef.current != "UP") {
            setDirection("DOWN");
            directionRef.current = "DOWN";
        }
        if (e.key === 'ArrowLeft' && directionRef.current != "RIGHT") {
            setDirection("LEFT");
            directionRef.current = "LEFT";
        }
    }

    const [board, setBoard] = useState(createBoard(boardSize))
    const [score, setScore] = useState(0);
    const [snakeArr, setSnakeArr] = useState([{ x: 5, y: 3 }, { x: 5, y: 2 }, { x: 5, y: 1 }]);
    const [snakeSet, setSnakeSet] = useState(new Set([51, 50, 49]));
    const [direction, setDirection] = useState("RIGHT");
    const directionRef = useRef(direction);
    const [foodCell, setFoodCell] = useState(generateFoodCells(1, boardSize));
    const [pause, setPause] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [gameOverMessage, setGameOverMessage] = useState("");
    useEffect(() => {
        window.addEventListener("keydown", handleDirectionChange)
    }, [])

    useInterval(() => {
        if (!pause) {
            moveSnake();
        }
    }, 300);
    if (gameOver) {
        return (
            <div>
                <p>Game-Over Bitch!</p>
                <h1>{score} </h1>
                <h3>{gameOverMessage}</h3>
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
                                    return (
                                        <div key={index}
                                            className={`cell ${snakeSet.has(element) ? "cellRed" : ""} ${element == getValueFromCoordinates(foodCell) ? "cellGreen" : ""} `}
                                        >

                                        </div>
                                    )
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
import React, { useEffect, useRef, useState } from 'react'
import './Board.css'
import { useInterval } from '../hooks/useInterval'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'
// import "../media/snakeImg.png" 

function Board() {
    const eatingAudio = new Audio(require('../media/eating.mp3'))
    const gameOverAudio = new Audio(require('../media/gameOver.mp3'))
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
        // gameOverAudio.play();
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
            // eatingAudio.play();
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
        console.log("direction Ref -> ", directionRef);
        console.log("directionChangeAllowed -> ", directionChangeAllowed);
        if (directionChangeAllowed.current) {

            if (e.key === 'ArrowUp' && directionRef.current != "DOWN" && directionChangeAllowed.current) {
                setDirection("UP");
                directionRef.current = "UP";
            }
            if (e.key === 'ArrowRight' && directionRef.current != "LEFT" && directionChangeAllowed.current) {
                setDirection("RIGHT");
                directionRef.current = "RIGHT";
            }
            if (e.key === 'ArrowDown' && directionRef.current != "UP" && directionChangeAllowed.current) {
                setDirection("DOWN");
                directionRef.current = "DOWN";
            }
            if (e.key === 'ArrowLeft' && directionRef.current != "RIGHT" && directionChangeAllowed.current) {
                setDirection("LEFT");
                directionRef.current = "LEFT";
            }
            directionChangeAllowed.current = false;
            setTimeout(() => { directionChangeAllowed.current = true }, 100);
        }
    }
    const handleRestart = () => {
        setBoard(createBoard(boardSize));
        setScore(0);
        setSnakeArr([{ x: 5, y: 3 }, { x: 5, y: 2 }, { x: 5, y: 1 }]);
        setSnakeSet(new Set([51, 50, 49]));
        setDirection("RIGHT");
        directionRef.current = "RIGHT";
        setFoodCell(generateFoodCells(1, boardSize));
        setPause(false);
        setGameOver(false);
        setGameOverMessage("");
        setGameSpeed(500);
        return;
    }
    const [board, setBoard] = useState(createBoard(boardSize))
    const [score, setScore] = useState(0);
    const [snakeArr, setSnakeArr] = useState([{ x: 5, y: 3 }, { x: 5, y: 2 }, { x: 5, y: 1 }]);
    const [snakeSet, setSnakeSet] = useState(new Set([51, 50, 49]));
    const [direction, setDirection] = useState("RIGHT");
    const directionChangeAllowed = useRef(true);
    const directionRef = useRef(direction);
    const [foodCell, setFoodCell] = useState(generateFoodCells(1, boardSize));
    const [pause, setPause] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [gameStart, setGameStart] = useState(true);
    const [gameOverMessage, setGameOverMessage] = useState("");
    const [gameSpeed, setGameSpeed] = useState(500);
    useEffect(() => {
        window.addEventListener("keydown", handleDirectionChange)
    }, [])

    useInterval(() => {
        if (!gameStart && !pause) {
            moveSnake();
        }
    }, gameSpeed);
    if (gameStart) {
        return (
            <div className='gameStartContainer'>
                <div className='snakeImgContainer'>
                    <img src={require("../media/snakeImgGif.gif")} className='snakeImg' />
                </div>
                <button className='gameStartButton' onClick={() => {
                    setGameStart(false);
                }}>Start Snake </button>
            </div>
        )
    }
    if (gameOver) {
        return (
            <div className='gameOverContainer'>
                <p className='gameOverText'>Game-Over</p>
                <img src={require("../media/gameOverSnakeImg.png")} className='snakeImg' />
                <h1 className='gameOverScore'>{score} </h1>
                <h3 className='gameOverMessage'>{gameOverMessage}</h3>
                <button className='restartButton' onClick={() => {
                    handleRestart();
                }}>Restart</button>
            </div>
        )
    }
    return (
        <>
            <div className='boardContainer'>
                <div className='upperPart'>
                    <div className='score'>{score}</div>
                    <div className='speed'>
                        <FontAwesomeIcon icon={faPlus} className='fa-lg' color='#FFD2D7'
                            onClick={() => { setGameSpeed((prev) => prev - 100) }} />
                        <p className='speedText'>speed</p>
                        <FontAwesomeIcon icon={faMinus} className='fa-lg' color='#FFD2D7'
                            onClick={() => { setGameSpeed((prev) => prev + 100) }} />
                    </div>
                    <div className='buttonContainer'>
                        <button
                            onClick={() => { setPause((prevState) => !prevState) }}
                            className='play-pause-button'
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
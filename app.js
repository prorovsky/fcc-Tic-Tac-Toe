"use strict";

const table = document.querySelector("table"),
    cells = document.querySelectorAll("td"),
    playerControls = document.querySelector(".player-select"),
    sideX = document.getElementById("X"),
    resetButton = document.getElementById("reset"),
    startButton = document.getElementById("start"),
    winningPositions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

let isGameStart = false,
    stopGame = false,
    humanPlayer,
    aiPlayer,
    board;

startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", resetGameState);

function startGame() {
    isGameStart = true;
    setPlayersSide(sideX);
    hideOrDisplayMenu(isGameStart);
    prepareTable();
}

function prepareTable() {
    table.addEventListener("click", giveTdValue);
    board = Array.from(Array(9).keys());
}

function giveTdValue(e) {
    if(e.target.tagName === "TD" && e.target.textContent === "") {
        playerTurn(e.target.id, humanPlayer);
        if(!stopGame) aiTurn(aiPlayer);
    }
}

function playerTurn(cell, playerSide) {
    board[cell] = playerSide;
    setValueToCell(cell, playerSide);
    checkWinCondition(playerSide);
}

function aiTurn(aiSide) {
    const emptyCells = board.filter(cell => typeof cell === 'number');
    playerTurn(emptyCells[0], aiSide);
}

function setPlayersSide(side) {
    humanPlayer = checkPlayerSide(side.checked);
    aiPlayer = checkPlayerSide(!side.checked);
}

function checkPlayerSide(side) {
    return side ? "X" : "O";
}

function setValueToCell(cell, playerSide) {
    if(cell === undefined) return;
    document.getElementById(cell).innerText = playerSide;
}

function hideOrDisplayMenu(gameState) {
    gameState ? playerControls.style.display = "none" : playerControls.style.display = "block";
}

function checkWinCondition(playerSide) {
    const playerCells = allPlayerCells([], playerSide);
    checkIfPlayerWinThisTurn(playerCells, playerSide);
    if(!stopGame) checkForTie();
}

function checkIfPlayerWinThisTurn(playerCells, playerSide) {
    for(let win of winningPositions) {
        let winCond = win.every((elem) => {
            return playerCells.includes(elem);
        });
        if(winCond) {
            displayWinner(playerSide);
            break;
        }
    }
}

function displayWinner(playerSide) {
    playerSide === humanPlayer ? console.log('You win!') : console.log('AI win!');
    stopGame = true;
}

function allPlayerCells(arr, playerSide) {
    board.forEach((cell, index) => {
        if(cell === playerSide) arr.push(index);
    });
    return arr;
}

function checkForTie() {
    const isFreeCellExist = board.some(cell => typeof cell === 'number');
    if(!isFreeCellExist) {
        console.log('It is a Tie!');
        stopGame = true;
    }
}

function resetGameState() {
    isGameStart = false;
    stopGame = false;
    table.removeEventListener("click", giveTdValue);
    hideOrDisplayMenu(isGameStart);
    cells.forEach(cell => cell.innerText = "");
}

// messages for start and and battle like lets fight, decent opponent, I will crush you
// better luck next time, I love you, send nudes
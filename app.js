"use strict";

const table = document.querySelector("table"),
    cells = document.querySelectorAll("td"),
    playerControls = document.querySelector(".player-select"),
    sideX = document.getElementById("X"),
    sideO = document.getElementById("O"),
    resetButton = document.getElementById("reset"),
    startButton = document.getElementById("start"),
    winningPosition = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [6, 4, 2]
    ];

let isGameStart = false,
    board;

startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", resetGameState);

function startGame() {
    isGameStart = true;
    checkGameStart(isGameStart);
    prepareTable();
    console.log("Board state:")
    console.log(board);
}

function prepareTable() {
    table.addEventListener("click", giveTdValue);
    board = Array.from(Array(9).keys());
}

function giveTdValue(e) {
    if(e.target.tagName === "TD" && e.target.textContent === "") {
        board[e.target.id] = playerSide(sideX.checked);
        setValueToCell(e.target.id, playerSide(sideX.checked));
        aiTurn();
    }
}

function aiTurn() {
    let emptyCells = board.filter(cell => typeof cell === 'number');
    setValueToCell(emptyCells[0], aiSide(sideX.checked));
    board[emptyCells[0]] = aiSide(sideX.checked);
    console.log("Empty cells:");
    console.log(emptyCells);
}

function playerSide(side) {
    return side ? "X" : "O";
}

function aiSide(side) {
    return side ? "O" : "X";
}

function setValueToCell(cell, playerSide) {
    document.getElementById(cell).innerText = playerSide;
}

function checkGameStart(gameState) {
    gameState ? playerControls.style.display = "none" : playerControls.style.display = "block";
}

function resetGameState() {
    isGameStart = false;
    table.removeEventListener("click", giveTdValue);
    checkGameStart(isGameStart);
    cells.forEach(cell => cell.innerText = "");
}

// messages for start and and battle like lets fight, decent opponent, I will crush you
// better luck next time, I love you, send nudes
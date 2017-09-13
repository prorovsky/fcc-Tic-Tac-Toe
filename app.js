"use strict";

const table = document.querySelector("table"),
    cells = document.querySelectorAll("td"),
    playerControls = document.querySelector(".player-select"),
    sideX = document.getElementById("X"),
    sideO = document.getElementById("O"),
    resetButton = document.getElementById("reset"),
    startButton = document.getElementById("start"),
    board = Array.from(Array(9).keys()),
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

let isGameStart = false;

startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", resetGameState);

function startGame() {
    isGameStart = true;
    checkGameStart(isGameStart);
    prepareTable();
}

function prepareTable() {
    table.addEventListener("click", giveTdValue);
}

function giveTdValue(e) {
    if(e.target.tagName === "TD" && e.target.textContent === "") {
        setValueToCell(e.target, checkPlayerSide());
    }
}

function checkPlayerSide() {
    return sideX.checked ? "X" : "O"; 
}

function setValueToCell(cell, playerSide) {
    cell.innerText = playerSide;
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
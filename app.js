"use strict";

const table = document.querySelector("table"),
    cells = document.querySelectorAll("td"),
    playerControls = document.querySelector(".player-select"),
    sideX = document.getElementById("X"),
    resetButton = document.getElementById("reset"),
    startButton = document.getElementById("start"),
    messageField = document.querySelector(".finish"),
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

var stopGame = false,
    humanPlayer,
    aiPlayer,
    board;

startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", resetGameState);

function startGame() {
    setPlayersSide(sideX);
    hideOrDisplayMenu(true);
    prepareTable();
}

function prepareTable() {
    table.addEventListener("click", giveTdValue);
    board = Array.from(Array(9).keys());
}

function giveTdValue(e) {
    if(!stopGame) {
        if(e.target.tagName === "TD" && e.target.textContent === "") {
            playerTurn(e.target.id, humanPlayer);
            aiTurn();
        }
    }
}

function aiTurn() {
    const aiChosenCell = minmax(board, aiPlayer).index;
    playerTurn(aiChosenCell, aiPlayer);
}

function playerTurn(cell, playerSide) {
    board[cell] = playerSide;
    setValueToCell(cell, playerSide);
    checkWinCondition(playerSide);
}

function minmax(newBoard, playerSide) {
    const availSpots = emptyCells(newBoard);

    if(checkWin(newBoard, humanPlayer)) {
        return { score: -10 }
    } else if(checkWin(newBoard, aiPlayer)) {
        return { score: 10 }
    } else if(availSpots.length === 0) {
        return { score: 0 }
    }

    const moves = collectAllMoves(availSpots, playerSide, newBoard);
    return collectionOfBestMoves(moves, playerSide);
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winningPositions.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function collectAllMoves(availSpots, playerSide, newBoard) {
    const moves = [];
    for(let index of availSpots.keys()) {
        const move = {};
		move.index = newBoard[availSpots[index]];
		newBoard[availSpots[index]] = playerSide;
        move.score = playerSide === aiPlayer ? minmax(newBoard, humanPlayer).score : minmax(newBoard, aiPlayer).score;
		newBoard[availSpots[index]] = move.index;
		moves.push(move);
    }
    return moves;
}

function collectionOfBestMoves(allMoves, playerSide) {
    const bestMove = playerSide === aiPlayer ? bestMoveIfAiPlayer(allMoves) : bestMoveIfHumanPlayer(allMoves); 
    return allMoves[bestMove];
}

function bestMoveIfAiPlayer(allMoves) {
    let bestScore = -10000,
        tempBestMove;
    for(let index of allMoves.keys()) {
        if(allMoves[index].score > bestScore) {
            bestScore = allMoves[index].score;
            tempBestMove = index;
        } 
    }
    return tempBestMove;
}

function bestMoveIfHumanPlayer(allMoves) {
    let bestScore = 10000,
        tempBestMove;
    for(let index of allMoves.keys()) {
        if(allMoves[index].score < bestScore) {
            bestScore = allMoves[index].score;
            tempBestMove = index;
        } 
    }
    return tempBestMove;
}

function emptyCells(board) {
    return board.filter(cell => typeof cell === "number");
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
        if(isWinCondition(win, playerCells)) {
            displayWinner(playerSide);
            break;
        }
    }
}

function isWinCondition(arrOfWinPositions, playerCells) {
    return arrOfWinPositions.every(elem => {
        return playerCells.includes(elem);
    });
}

function displayWinner(playerSide) {
    playerSide === humanPlayer ? createMessage("No!!! You can't win!") : createMessage("AI Win!");
    stopGame = true;
}

function createMessage(message) {
    let p = document.createElement("p");
    p.innerText = message;
    messageField.appendChild(p);
}

function allPlayerCells(arr, playerSide) {
    board.forEach((cell, index) => {
        if(cell === playerSide) arr.push(index);
    });
    return arr;
}

function checkForTie() {
    const isFreeCellExist = board.some(cell => typeof cell === "number");
    if(!isFreeCellExist) {
        createMessage("It's a Draw!");
        stopGame = true;
    }
}

function resetGameState() {
    stopGame = false;
    table.removeEventListener("click", giveTdValue);
    hideOrDisplayMenu(false);
    clearMessageField();
    cells.forEach(cell => cell.innerText = "");
}

function clearMessageField() {
    messageField.innerHTML = "";
}
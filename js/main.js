'use strict'

const FLAG = '🚩';

var gBoard = [];
var gLevel = {
    size: 4,
    mines: 2
};
var gMines;
var gGame = {
    isOn: false,
    cellsCount: null,
    showCount: 0,
    markedCount: 0,
    timeStarted: null,
    secsPassed: 0,
    intervalId: 0
};


function initGame() {
    gGame.isOn = false;
    gBoard = buildBoard()
    gBoard = setMinesNegsCount(gBoard);
    renderBoard(gBoard);
};

function locateMines() {
    // Clear gMines so we have a clean array to begin with:
    gMines = [];
    // Mines count corresponds to the global setting:
    var count = gLevel.mines;
    for (let i = 0; i < count; i++) {
        // Generate a random location
        var randI = getRandomInt(0, gLevel.size - 1);
        var randJ = getRandomInt(0, gLevel.size - 1);
        if (!gMines.includes(`${randI},${randJ}`)) {
            // Only if current i,j isn't *ALREADY* a mine: 
            // Push generated mine:
            gMines.push(`${randI},${randJ}`);
        } else {
            // If current (i,j) is a mine indeed:
            // Run again:
            --i;
        }
    }
    return gMines;
};

function buildBoard() {
    var size = gLevel.size;
    var mines = locateMines();
    var board = [];
    for (var i = 0; i < size; i++) {
        // Create row:
        board.push([]);
        for (var j = 0; j < size; j++) {
            // Create cells inside row

            // Default cells are NOT mines
            board[i][j] = {
                // setMinesNegCount() will be use below:
                minesAroundCount: -1,

                isShown: false,
                isMine: false,
                isMarked: false
            };
            // If gMines includes (i,j) it is a MINE:
            if (mines.includes(`${i},${j}`)) {
                board[i][j] = {
                    // setMinesNegCount() will be use below:
                    minesAroundCount: -1,

                    isShown: false,
                    isMine: true,
                    isMarked: false
                };
            }
        }
    }
    return board;
};

function setMinesNegsCount(board) {

    // Loop on gBoard:
    for (let i = 0; i < board.length; i++) {
        // Loop on rows:
        for (let j = 0; j < board[i].length; j++) {
            // Calculate the value for each cell
            // loop on negs:                
            board[i][j].minesAroundCount = countNegs(board, i, j);
        }
    }
    return board;
};

function countNegs(board, rowIdx, colIdx) {
    var negsXCount = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board[i].length - 1) continue;
            if (i === rowIdx && j === colIdx) continue
            if (board[i][j].isMine) negsXCount++;
        }
    }
    return negsXCount;
}

function renderBoard(board) {
    var strHTML = '<table><tbody>';
    for (var i = 0; i < board.length; i++) {
        // Create table row:
        strHTML += '<tr>';
        for (var j = 0; j < board.length; j++) {
            // For now there are only 2 options (X/O):
            var cell;
            if (board[i][j].isShown) {
                var minesAroundCount = board[i][j].minesAroundCount;
                cell = (board[i][j].isMine) ? 'X' : minesAroundCount;
            } else {
                cell = ' ';
            }
            var className = 'cell cell' + i + '-' + j;
            var cellClicked = 'cellClicked(this, event, ' + i + ',' + j + ')'

            // Create table cell:
            strHTML += '<td class="' + className + '" onmousedown="' + cellClicked + '"> ' + cell + ' </td>'
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elMat = document.querySelector('.minesweeper-mat');
    elMat.innerHTML = strHTML;
};

function cellClicked(elCell, event, i, j) {
    console.log('Event.button:', event.button);
    if ((!gGame.isOn) && gGame.showCount === gLevel.size * gLevel.size - gLevel.mines) {

        // If game is off (by means):
        // It hasn't started  *OR*  already finished (all mines were exposed)
        // Don't run:
        console.log('you\'re clicks mean nothing to me');
        return;

    } else if (!gGame.isOn && gGame.showCount === 0) {

        // If this is the first click:
        // Start game globally:
        gGame.isOn = true;

        // Start timer:
        gGame.timeStarted = new Date();
        gGame.intervalId = setInterval(function () {

            // Math.floor is used to show secs as integer, / 1000 is used as the defalut is milliesecs:
            gGame.secsPassed = Math.floor((new Date() - gGame.timeStarted) / 1000);
            var elStopwatch = document.querySelector('.stopwatch');
            elStopwatch.innerText = gGame.secsPassed;
        }, 1000);

    } if (!gBoard[i][j].isMine && (!gBoard[i][j].isShown)) {
        // debugger;
        /////////////////////////////////////////////////////
        // SOME CODE BELOW SHOULD ALSO APPEAR ON LEFT CLICK//
        /////////////////////////////////////////////////////

        if (event.button === 0) {
            //if RIGHT CLICK:
            // if the cell is not shown + this is not a mine:
            // Show mines around count:
            elCell.innerText = gBoard[i][j].minesAroundCount;

            // Update isShown stats:
            gBoard[i][j].isShown = true;

            // Update showCount:
            gGame.showCount++

            if (gGame.showCount === gLevel.size * gLevel.size - gLevel.mines) {


                // If all cells without mines were clicked:
                console.log('victory!');

                // Stop the clock:
                clearInterval(gGame.intervalId);
                console.log(gGame.intervalId);

                // Stop the game:
                gGame.isOn = false;
                console.log(gGame);
            }
            console.log(gGame.showCount);
        } else if (event.button === 2) {
            console.log('Oh, you\'re the sophisticated type')
        }


    }
};

function cellMarked(elCell) {

};

function checkGameOver() {

};

function expandShown(board, elCell, i, j) {

};
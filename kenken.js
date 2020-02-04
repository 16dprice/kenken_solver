const boardSize = 6;
let board = Array.from(Array(boardSize), _ => Array(boardSize).fill(0));

// "squares" is a list of tuples corresponding to a row and col
// "op" denotes the operation
//      "x" for multiplication
//      "/" for division
//      "+" for addition
//      "-" for subtraction
// "res" is the desired result after the designated operation has been performed on the indicated squares
const rules = [
    {
        "squares": [[0,0], [0,1], [0,2], [1,1]],
        "op": "x",
        "res": 20
    },
    {
        "squares": [[0,3], [0,4], [0,5], [1,5]],
        "op": "x",
        "res": 360
    },
    {
        "squares": [[1,0], [2,0], [3,0], [3,1]],
        "op": "x",
        "res": 288
    },
    {
        "squares": [[1,2], [1,3]],
        "op": "-",
        "res": 3
    },
    {
        "squares": [[1,4], [2,3], [2,4], [3,4]],
        "op": "+",
        "res": 11
    },
    {
        "squares": [[2,1], [2,2]],
        "op": "/",
        "res": 2
    },
    {
        "squares": [[2,5], [3,5]],
        "op": "+",
        "res": 5
    },
    {
        "squares": [[3,2], [3,3]],
        "op": "-",
        "res": 2
    },
    {
        "squares": [[4,0], [5,0], [5,1]],
        "op": "x",
        "res": 12
    },
    {
        "squares": [[4,1], [4,2], [4,3]],
        "op": "+",
        "res": 15
    },
    {
        "squares": [[4,4], [5,4]],
        "op": "/",
        "res": 3
    },
    {
        "squares": [[4,5], [5,5]],
        "op": "-",
        "res": 1
    },
    {
        "squares": [[5,2], [5,3]],
        "op": "+",
        "res": 6
    },
];

// returns [row, col] where board[row][col] is empty if an empty spot exists
// returns -1 if board is complete
function findEmptyLocation() {
    for(let row = 0; row < boardSize; row++) {
        for(let col = 0; col < boardSize; col++) {
            if(board[row][col] === 0) {
                return [row, col];
            }
        }
    }
    return -1; // means that the board is complete
}

// true if num is used in row
// false otherwise
function usedInRow(row, num) {
    for(let col = 0; col < boardSize; col++) {
        if(board[row][col] === num) return true;
    }
    return false;
}

// true if num is used in column
// false otherwise
function usedInCol(col, num) {
    for(let row = 0; row < boardSize; row++) {
        if(board[row][col] === num) return true;
    }
    return false;
}

// 1 if OK
// 0 if not OK
// -1 if a square hasn't been populated with a value yet
function checkMult(squares, res) {

    let prod = 1;
    for(const square of squares) {
        let row = square[0];
        let col = square[1];

        // if square hasn't been populated yet
        if(board[row][col] === 0) return -1;

        prod *= board[row][col];
    }

    return prod === res ? 1 : 0;

}

// there should only be two squares given
function checkDiv(squares, res) {

    const row1 = squares[0][0];
    const col1 = squares[0][1];
    const val1 = board[row1][col1];

    const row2 = squares[1][0];
    const col2 = squares[1][1];
    const val2 = board[row2][col2];

    // if square hasn't been populated yet
    if(val1 === 0 || val2 === 0) return -1;

    return (val1 / val2 === res || val2 / val1 === res) ? 1 : 0;

}

function checkAdd(squares, res) {

    let sum = 0;
    for(const square of squares) {
        let row = square[0];
        let col = square[1];

        // if square hasn't been populated yet
        if(board[row][col] === 0) return -1;

        sum += board[row][col];
    }

    return sum === res ? 1 : 0;

}

// there should only be two squares given
function checkSub(squares, res) {

    const row1 = squares[0][0];
    const col1 = squares[0][1];
    const val1 = board[row1][col1];

    const row2 = squares[1][0];
    const col2 = squares[1][1];
    const val2 = board[row2][col2];

    // if square hasn't been populated yet
    if(val1 === 0 || val2 === 0) return -1;

    // if val1 - val2 or val2 - val1 is the result
    return Math.abs(val1 - val2) === res ? 1 : 0;

}

// returns true if the num is safe to use in the cage which encompasses the given row and column
function safeInCage(row, col, num) {

    let cageRule;
    for(const rule of rules) {
        for(const square of rule.squares) {
            if(square[0] === row && square[1] === col) cageRule = rule;
        }
    }

    // temporarily set it so I can check it
    const prevBoardVal = board[row][col];
    board[row][col] = num;

    let checkResult;
    switch(cageRule.op) {
        case "+":
            checkResult = checkAdd(cageRule.squares, cageRule.res);
            break;
        case "-":
            checkResult = checkSub(cageRule.squares, cageRule.res);
            break;
        case "x":
            checkResult = checkMult(cageRule.squares, cageRule.res);
            break;
        case "/":
            checkResult = checkDiv(cageRule.squares, cageRule.res);
            break;
        default:
            checkResult = -1;
    }

    // reset the board spot
    board[row][col] = prevBoardVal;

    return checkResult === 1 || checkResult === -1;
}

// true if it's okay to place num at the spot row, col
// false otherwise
function isLocationSafe(row, col, num) {
    return ( !usedInRow(row, num) && !usedInCol(col, num) && safeInCage(row, col, num) );
}

function solveKenKen() {

    // it's been solved already
    if(findEmptyLocation() === -1) return true;

    let [row, col] = findEmptyLocation();

    for(let num = 1; num <= boardSize; num++) {
        if(isLocationSafe(row, col, num)) {
            // make tentative assignment
            board[row][col] = num;

            // if it succeeds, yay!
            if(solveKenKen()) return true;

            // failure, undo and try again
            board[row][col] = 0;
        }
    }

    // triggers backtracking
    return false;

}

console.table(board);
solveKenKen();
console.table(board);

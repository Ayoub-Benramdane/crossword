//initialize the solution array to hold all the valid solutions
let solutions = [];

// const puzzle = '2001\n0..0\n1000\n0..0'
// const words = ['casa', 'alan', 'ciao', 'anta']

// const puzzle = `...1...........
// ..1000001000...
// ...0....0......
// .1......0...1..
// .0....100000000
// 100000..0...0..
// .0.....1001000.
// .0.1....0.0....
// .10000000.0....
// .0.0......0....
// .0.0.....100...
// ...0......0....
// ..........0....`
// const words = [
//   'sun',
//   'sunglasses',
//   'suncream',
//   'swimming',
//   'bikini',
//   'beach',
//   'icecream',
//   'tan',
//   'deckchair',
//   'sand',
//   'seaside',
//   'sandals',
// ]


// const puzzle = `..1.1..1...
// 10000..1000
// ..0.0..0...
// ..1000000..
// ..0.0..0...
// 1000..10000
// ..0.1..0...
// ....0..0...
// ..100000...
// ....0..0...
// ....0......`
// const words = [
//   'popcorn',
//   'fruit',
//   'flour',
//   'chicken',
//   'eggs',
//   'vegetables',
//   'pasta',
//   'pork',
//   'steak',
//   'cheese',
// ]

const puzzle = `...1...........
..1000001000...
...0....0......
.1......0...1..
.0....100000000
100000..0...0..
.0.....1001000.
.0.1....0.0....
.10000000.0....
.0.0......0....
.0.0.....100...
...0......0....
..........0....`
const words = [
  'sun',
  'sunglasses',
  'suncream',
  'swimming',
  'bikini',
  'beach',
  'icecream',
  'tan',
  'deckchair',
  'sand',
  'seaside',
  'sandals',
].reverse()


crosswordSolver(puzzle, words)


// the function check if the puzzle is valid, if it return the puzzle as 2d array
function validateAndSplit(emptyPuzzle){
    let arrHolder
    if (!(typeof emptyPuzzle === 'string' && emptyPuzzle.length !== 0)) {
        return false
    }
    arrHolder = emptyPuzzle.split('\n').map(ele => ele.split(''))
    // return false if found one element don't include in [012.]
    let length = arrHolder[0].length;
    for (let i=0; i< arrHolder.length; i++) {
        if (arrHolder[i].length !== length) {
            return false
        }
        arrHolder[i].forEach(char => ['0', '1', '2', '.'].includes(char))
    }
    return arrHolder
}


//check function check for the validity of the words
//it must be an Array, don't duplicuited, with only characters [a-z]
function invalidWords(words){
    //check if it in array
    if (!Array.isArray(words)) return true
    //check for duplication
    const mySet = new Set(words);
    if (mySet.size !== words.length) return true;
    // check for no ascci characters.

    for (const word of words) { 
        if (typeof word !== 'string') return true;
        let letters = [...word].find(l => l.match(/[^a-z]/i))
        if (letters) return true
    };
    return false
}

function checkNumbers(matrix, length) {
    let count = 0;
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] === '1' || matrix[i][j] === '2') {
                count+= Number(matrix[i][j]);
            }
        }
    }
    return count === length;
}

function cloneArr(arr) {
    if (!Array.isArray(arr)) {
        console.log('Error')
        return
    }
    return arr.map((elem) => [...elem])
}

function checkStarts(matrix) {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] == '2') {
                if (!(['.', undefined].includes(matrix[i][j-1]) && ['.', undefined].includes(matrix[i-1][j]))) {
                    return false
                }
            }
            if (matrix[i][j] == '1') {
                if (!(['.', undefined].includes(matrix[i][j-1]) || ['.', undefined].includes(matrix[i-1][j]))) {
                    return false
                }
            }
        }
    }
    return true
}

function crosswordSolver(emptyPuzzle, words) {
    let table = validateAndSplit(emptyPuzzle);
    let valid = checkNumbers(table, words.length);
    if (!table || !valid) {
        console.log('Error')
        return
    }
    if (invalidWords(words) || words.length === 0) {
        console.log('Error')
        return
    }
    // Ensure table is cloned properly before passing to solvePuzzle
    solvePuzzle(table, cloneArr(table), words, 0)
    if (solutions.length !== 1) {
        console.log("Error")
    } else {
        console.log(solutions[0].map(line => line.join("")).join("\n"))
    }
}

function solvePuzzle(puzzle, matrix, words, index) {
    if (index === words.length) {
        if (isValid(matrix)) {
            solutions.push(matrix)
        }
        return
    }
    const rows = matrix.length;
    const cols = matrix[0].length;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (!['1', '2'].includes(puzzle[r][c])) continue;
            try {
                const tempMatrix = checkHorizantal(matrix, words[index], c, r)
                solvePuzzle(puzzle, tempMatrix, words, index + 1)
            } catch (_) {
            }
            try {
                const tempMatrix1 = checkVertical(matrix, words[index], c, r)
                solvePuzzle(puzzle, tempMatrix1, words, index + 1)
            } catch (_) {
            }
        }
    }
}


function isValid(matrix) {
    for (let i=0; i< matrix.length; i++) {
        for (let j=0; j < matrix[i].length; j++) {
            if (['1', '2', '0'].includes(matrix[i][j])) return false
        }
    }
    return true
}

function checkHorizantal(matrix, word, x, y) {
    let temp = cloneArr(matrix)
    const horLength = matrix[0].length - x;
    if (horLength < word.length)
        throw new Error("Error");
    for (let i = 0; i < horLength; i++) {
        if (i === word.length) {
            if (matrix[y][x + i] === '.') {
                break
            } else {
                throw new Error("Error")
            }
        }
        if (['0', '1', '2', word[i]].includes(matrix[y][x + i])) {
            temp[y][x + i] = word[i]
        } else {
            throw new Error("Error")
        };
    }
    return temp
}

function checkVertical(matrix, word, x, y) {
    let temp = cloneArr(matrix)
    const verLength = matrix.length - y;
    if (verLength < word.length)
        throw new Error("Error");
    for (let i = 0; i < verLength; i++) {
        if (i === word.length) {
            if (matrix[y + i][x] === '.') {
                break
            } else {
                throw new Error("Error")
            }
        }
        if (['0', '1', '2', word[i]].includes(matrix[y + i][x])) {
            temp[y + i][x] = word[i]
        } else {
            throw new Error("Error")
        }
    }
    return temp
}

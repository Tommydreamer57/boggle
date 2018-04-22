import Path from './Path';
import Letter from './Letter';
import statics from './statics';

// const board = [
//     ['K', 'X', 'O', 'Z', 'V', 'F'],
//     ['B', 'A', 'M', 'L', 'H', 'R'],
//     ['V', 'U', 'Q', 'J', 'M', 'S'],
//     ['V', 'A', 'J', 'A', 'M', 'K'],
//     ['V', 'I', 'T', 'T', 'D', 'O'],
//     ['U', 'P', 'K', 'B', 'A', 'B'],
// ];

export default class Boggle {
    static Path = Path
    static Letter = Letter
    static validDirections = statics.validDirections
    static frequencies = statics.frequencies
    static getRandomLetter = statics.getRandomLetter
    static createBoard = statics.createBoard
    constructor() {
        let board, x, y;
        if (Array.isArray(arguments[0])) {
            board = arguments[0];
            if (!board.every(row => Array.isArray(row))) throw new Error('board must be a two dimensional array');
            if (!board.every((row, i) => row.length === (board[i + 1] || board[0]).length)) throw new Error('all rows must be of equal length');
            y = board.length;
            x = board[0].length;
        } else if (typeof arguments[0] === 'object') {
            board = [];
            x = arguments[0].x;
            y = arguments[0].y;
        } else {
            board = [];
            x = arguments[0];
            y = arguments[1] || x;
        }
        if (!x && !y) {
            x = y = 4;
        }
        if (x <= 0 || y <= 0) throw new Error('dimensions must be positive');

        // IF WE ARE GIVEN A BOARD
        let previousLetters = [];
        if (board.length) {
            board = board.map(row => row.map(letter => {
                const newLetter = new Boggle.Letter(letter, previousLetters);
                previousLetters.push(newLetter);
                return newLetter;
            }));
        } else {
            // IF WE ARE NOT GIVEN A BOARD
            // CREATE A BOARD
            for (let i = 0; i < y; i++) {
                const row = [];
                for (let j = 0; j < x; j++) {
                    const newLetter = new Boggle.Letter(null, previousLetters);
                    previousLetters.push(newLetter);
                    row.push(newLetter);
                }
                board.push(row);
            }
        }

        for (let i = 0; i < board.length; i++) {
            let prevRow = board[i - 1] || [];
            let row = board[i];
            let nextRow = board[i + 1] || [];
            for (let j = 0; j < row.length; j++) {
                let letter = row[j];
                let left = row[j - 1];
                let right = row[j + 1];
                let up = prevRow[j];
                let down = nextRow[j];
                let upLeft = prevRow[j - 1];
                let upRight = prevRow[j + 1];
                let downLeft = nextRow[j - 1];
                let downRight = nextRow[j + 1];
                Object.assign(letter, {
                    coordinates: {
                        y: i,
                        x: j
                    },
                    left,
                    right,
                    up,
                    down,
                    upLeft,
                    upRight,
                    downLeft,
                    downRight,
                });
            }
        }

        this.board = board;
        this.dimensions = { x, y };
    }
    validate(word) {
        if (!word) return [];
        word = word.toUpperCase().split('').reduce((arr, val) => {
            if (arr[arr.length - 1] === "Q" && val === "U") arr[arr.length - 1] += val;
            else arr.push(val);
            return arr;
        }, []);

        // console.log(word);

        function walkPath(currentLetter, validPaths, currentPath = []) {

            currentPath.push(currentLetter);

            let adjacentLetters = currentLetter.adjacentLetters;
            let nextLetter = word[currentPath.length];

            if (!nextLetter) {
                validPaths.push(currentPath);
                return validPaths;
            }

            const nextPaths = [];

            findNextLetters: for (let prop in currentLetter) {
                if (Boggle.validDirections.includes(prop) && currentLetter[prop]) {
                    if (currentLetter[prop].value.toUpperCase() === nextLetter && !currentPath.includes(currentLetter[prop])) {
                        nextPaths.push(currentLetter[prop]);
                    }
                }
            }

            nextPaths.forEach(currentLetter => {
                walkPath(currentLetter, validPaths, [...currentPath]);
            });

            return validPaths;
        }

        const startingPoints = [];

        const validPaths = [];

        findStartingRows:
        for (let y = 0; y < this.board.length; y++) {
            const row = this.board[y];

            findStartingIndices:
            for (let x = 0; x < row.length; x++) {
                if (row[x].value.toUpperCase() === word[0]) {
                    startingPoints.push(row[x]);
                }
            }
        }

        startingPoints.forEach(startingLetter => {
            walkPath(startingLetter, validPaths);
        });

        // if (!validPaths.length) return false;

        return validPaths;
    }
    startPath(x, y) {
        if (typeof x === 'object') {
            y = x.y;
            x = x.x;
        };
        if (x >= this.dimensions.x || x < 0) throw new Error('invalid coordinate x: ' + x);
        if (y >= this.dimensions.y || y < 0) throw new Error('invalid coordinate y: ' + y);
        if ((!x && x !== 0) || (!y && y !== 0)) throw new Error('must specify coordinates x & y');
        let { board } = this;
        let start = { x, y };
        return new Boggle.Path({ board, start });
    }
}

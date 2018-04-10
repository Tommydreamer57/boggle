function getRandomLetter(previousLetters = [], dimension = 0) {
    // SCRABBLE
    const scrabble = {
        A: 13,
        B: 3,
        C: 3,
        D: 6,
        E: 18,
        F: 3,
        G: 4,
        H: 3,
        I: 12,
        J: 2,
        K: 2,
        L: 5,
        M: 3,
        N: 8,
        O: 11,
        P: 3,
        Qu: 2,
        R: 9,
        S: 6,
        T: 9,
        U: 6,
        V: 3,
        W: 3,
        X: 2,
        Y: 3,
        Z: 2
    };
    // BOGGLE
    const lettersObj = {
        A: 12,
        B: 1,
        C: 5,
        D: 6,
        E: 19,
        F: 4,
        G: 3,
        H: 5,
        I: 11,
        J: 1,
        K: 1,
        L: 5,
        M: 4,
        N: 11,
        O: 11,
        P: 4,
        Qu: 1,
        R: 12,
        S: 9,
        T: 13,
        U: 4,
        V: 1,
        W: 2,
        X: 1,
        Y: 3,
        Z: 1
    };
    // BOGGLE FIVE BY FIVE
    const fiveByFive = [
        "aaafrs",
        "aaeeee",
        "aafirs",
        "adennn",
        "aeeeem",
        "aeegmu",
        "aegmnn",
        "afirsy",
        "bjkqxz",
        "ccenst",
        "ceiilt",
        "ceilpt",
        "ceipst",
        "ddhnot",
        "dhhlor",
        "dhlnor",
        "dhlnor",
        "eiiitt",
        "emottt",
        "ensssu",
        "fiprsy",
        "gorrvw",
        "iprrry",
        "nootuw",
        "ooottu",
    ]
    // BOGGLE FIVE BY FIVE
    const otherFiveByFive = [
        "AAAFRS",
        "AAEEEE",
        "AAFIRS",
        "ADENNN",
        "AEEEEM",
        "AEEGMU",
        "AEGMNN",
        "AFIRSY",
        "BJKQXZ",
        "CCNSTW",
        "CEIILT",
        "CEILPT",
        "CEIPST",
        "DHHNOT",
        "DHHLOR",
        "DHLNOR",
        "DDLNOR",
        "EIIITT",
        "EMOTTT",
        "ENSSSU",
        "FIPRSY",
        "GORRVW",
        "HIPRRY",
        "NOOTUW",
        "OOOTTU"
    ]
    previousLetters.forEach(letter => {
        lettersObj[letter]--;
    });
    const lettersArr = [];
    for (let prop in lettersObj) {
        for (let i = 0; i < lettersObj[prop]; i++) {
            lettersArr.push(prop);
        }
    }
    return lettersArr[~~(Math.random() * lettersArr.length)];
}

const validDirections = [
    'upLeft',
    'up',
    'upRight',
    'right',
    'downRight',
    'down',
    'downLeft',
    'left'
];

class Letter {
    constructor(val, previousLetters = []) {
        if (!val) val = getRandomLetter(previousLetters.map(letter => letter.value));
        this.value = val;
        this.coordinates = {};
    }
    get adjacentLetters() {
        const letters = [];
        for (let prop in this) {
            if (validDirections.includes(prop) && this[prop]) {
                letters.push(this[prop].value);
            }
        }
        return letters;
    }
    get adjacentLetterObjects() {
        const letters = [];
        for (let prop in this) {
            if (validDirections.includes(prop) && this[prop]) {
                letters.push(this[prop]);
            }
        }
        return letters;
    }
}

class Boggle {
    constructor() {
        let board, x, y;

        if (Array.isArray(arguments[0])) {
            board = arguments[0];
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
            // throw new Error('Boggle requires dimensions, please specify x or y');
            // DEFAULT DIMENSIONS
            x = y = 5;
        }

        // IF WE ARE GIVEN A BOARD
        let previousLetters = [];
        if (board.length) {
            board = board.map(row => row.map(letter => {
                const newLetter = new Letter(letter, previousLetters);
                previousLetters.push(newLetter);
                return newLetter;
            }));
        } else {
            // IF WE ARE NOT GIVEN A BOARD
            // CREATE A BOARD
            for (let i = 0; i < y; i++) {
                const row = [];
                for (let j = 0; j < x; j++) {
                    const newLetter = new Letter(null, previousLetters);
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
        this.path = [new Letter(' ')];
        this.dimensions = { x, y };
    }
    // constructor(x, y) {
    //     if (typeof x === 'object') var { x, y } = x;
    //     if (!x && !y) throw new Error('Boggle requires dimensions, please specify x or y');
    //     if (!y) y = x;
    //     if (!x) x = y;

    //     const boggle = [];

    //     // const board = [
    //     // 	['K', 'X', 'O', 'Z', 'V', 'F'],
    //     // 	['B', 'A', 'M', 'L', 'H', 'R'],
    //     // 	['V', 'U', 'Q', 'J', 'M', 'S'],
    //     // 	['V', 'A', 'J', 'A', 'M', 'K'],
    //     // 	['V', 'I', 'T', 'T', 'D', 'O'],
    //     // 	['U', 'P', 'K', 'B', 'A', 'B'],
    //     // ];

    //     const previousLetters = [];

    //     for (let i = 0; i < y; i++) {
    //         const row = [];
    //         for (let j = 0; j < x; j++) {
    //             const letter = new Letter(null, previousLetters);
    //             previousLetters.push(letter.value);
    //             row.push(letter);
    //         }
    //         boggle.push(row);
    //     }

    //     for (let i = 0; i < boggle.length; i++) {
    //         let prevRow = boggle[i - 1] || [];
    //         let row = boggle[i];
    //         let nextRow = boggle[i + 1] || [];
    //         for (let j = 0; j < row.length; j++) {
    //             const letter = row[j];
    //             Object.assign(letter, {
    //                 coordinates: {
    //                     y: i,
    //                     x: j
    //                 },
    //                 left: row[j - 1],
    //                 right: row[j + 1],
    //                 up: prevRow[j],
    //                 down: nextRow[j],
    //                 upLeft: prevRow[j - 1],
    //                 upRight: prevRow[j + 1],
    //                 downLeft: nextRow[j - 1],
    //                 downRight: nextRow[j + 1]
    //             });
    //         }
    //     }

    //     this.board = boggle;
    //     // this.path = [this.board[0][0]];
    //     const letter = new Letter();
    //     letter.value = '';
    //     this.path = [letter];
    //     this.dimensions = { x, y };
    // }
    get currentWord() {
        return this.path.map(letter => letter.value).join('');
    }
    validate(word) {
        word = word.toUpperCase().split('').reduce((arr, val) => {
            if (arr[arr.length - 1] === "Q" && val === "U") arr[arr.length - 1] += val;
            else arr.push(val);
            return arr;
        }, []);

        console.log(word);

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
                if (validDirections.includes(prop) && currentLetter[prop]) {
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
    start(x, y) {
        if (typeof x === 'object') {
            y = x.y;
            x = x.x;
        };
        if (x > this.x) throw new Error('invalid coordinate x: ' + x);
        if (y > this.y) throw new Error('invalid coordinate y: ' + y);
        console.log(arguments);
        console.log(x, y);
        console.log(this);
        this.path = [this.board[y][x]];
        return this;
    }
    move(direction) {

        if (typeof direction === 'object') {

            const { x, y } = direction;

            const nextLetter = this.board[y][x];

            if (this.path[0] === nextLetter) {
                this.resetPath();
                return this;
            }

            if (this.path.includes(nextLetter)) {
                this.path = this.path.slice(0, this.path.indexOf(nextLetter));
                return this;
            }

            if (!this.path[this.path.length - 1].adjacentLetterObjects.some(letter => letter.coordinates.x === x && letter.coordinates.y === y)) throw new Error('invalid destination');


            this.path.push(nextLetter);

            return this;
        } else {

            if (!validDirections.includes(direction)) throw new Error('must specify legitimate direction');

            const nextLetter = this.path[this.path.length - 1][direction];

            if (!nextLetter) throw new Error('invalid direction from current position');
            if (this.path.includes(nextLetter)) throw new Error('letter already used: ' + nextLetter.value);

            this.path.push(nextLetter);

            return this;
        }
    }
    resetPath() {
        const letter = new Letter();
        letter.value = '';
        this.path = [letter];
    }
}

export default Boggle;

function getRandomLetter() {
    const lettersObj = {
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
        Q: 2,
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
    const lettersArr = [];
    for (let prop in lettersObj) {
        for (let i = 0; i < lettersObj[prop]; i++) {
            lettersArr.push(prop);
        }
    }
    return lettersArr[~~(Math.random() * lettersArr.length)];
}

const validDirections = ['up', 'down', 'left', 'right', 'upLeft', 'upRight', 'downLeft', 'downRight'];

class Letter {
    constructor(val) {
        if (!val) val = getRandomLetter();
        this.value = val;
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
    constructor(x, y) {
        if (typeof x === 'object') var { x, y } = x;
        if (!x && !y) throw new Error('Boggle requires dimensions, please specify x or y');
        if (!y) y = x;
        if (!x) x = y;

        const boggle = [];

        // const board = [
        // 	['K', 'X', 'O', 'Z', 'V', 'F'],
        // 	['B', 'A', 'M', 'L', 'H', 'R'],
        // 	['V', 'U', 'Q', 'J', 'M', 'S'],
        // 	['V', 'A', 'J', 'A', 'M', 'K'],
        // 	['V', 'I', 'T', 'T', 'D', 'O'],
        // 	['U', 'P', 'K', 'B', 'A', 'B'],
        // ];

        for (let i = 0; i < y; i++) {
            const row = [];
            for (let j = 0; j < x; j++) {
                row.push(new Letter());
            }
            boggle.push(row);
        }

        for (let i = 0; i < boggle.length; i++) {
            let prevRow = boggle[i - 1] || [];
            let row = boggle[i];
            let nextRow = boggle[i + 1] || [];
            for (let j = 0; j < row.length; j++) {
                const letter = row[j];
                Object.assign(letter, {
                    coordinates: {
                        y: i,
                        x: j
                    },
                    left: row[j - 1],
                    right: row[j + 1],
                    up: prevRow[j],
                    down: nextRow[j],
                    upLeft: prevRow[j - 1],
                    upRight: prevRow[j + 1],
                    downLeft: nextRow[j - 1],
                    downRight: nextRow[j + 1]
                });
            }
        }

        this.board = boggle;
        this.path = [this.board[0][0]];
        this.dimensions = { x, y };
    }
    get currentWord() {
        return this.path.map(letter => letter.value).join('');
    }
    validate(word) {
        word = word.toUpperCase().split('');

        function walkPath(startingLetter, currentLetter, validPaths, currentPath = []) {

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
                    if (currentLetter[prop].value === nextLetter && !currentPath.includes(currentLetter[prop])) {
                        nextPaths.push(currentLetter[prop]);
                    }
                }
            }

            nextPaths.forEach(currentLetter => {
                walkPath(startingLetter, currentLetter, validPaths, [...currentPath]);
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
                if (row[x].value === word[0]) {
                    startingPoints.push(row[x]);
                }
            }
        }

        startingPoints.forEach(startingLetter => {
            walkPath(startingLetter, startingLetter, validPaths);
        });

        if (!validPaths.length) return false;

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

            if (!this.path[this.path.length - 1].adjacentLetterObjects.some(letter => letter.coordinates.x === x && letter.coordinates.y === y)) throw new Error('invalid destination');

            const nextLetter = this.board[y][x];

            if (this.path.includes(nextLetter)) throw new Error('letter already used: ' + nextLetter.value);

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
}

export default Boggle;

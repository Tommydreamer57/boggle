import Letter from './Letter';
import statics from './statics';

export default class Path {
    static default = {
        board: [[Letter.default]],
        path: [Letter.default],
        currentWord: '',
        endOfPath: Letter.default,
        startOfPath: Letter.default,
        length: 0,
        equals: () => false,
        includes: () => false,
        some: () => false,
        every: () => false,
        move: () => Path.default,
    }
    constructor({ board, start }) {
        if (start instanceof Letter) {
            if (!board.some(row => row.includes(start))) throw new Error('must start at a legitimate coordinate');
            else this.path = [start];
        } else if (typeof start === 'object') {
            let { x, y } = start;
            if (y < 0 || y >= board.length) throw new Error('must start at a legitimate coordinate - Y: ' + y);
            if (x < 0 || x >= board[0].length) throw new Error('must start at a legitimate coordinate - X: ' + x);
            this.path = [board[y][x]];
        } else throw new Error('must specify starting point');

        statics.validDirections.forEach(direction => {
            this[direction] = this.move.bind(this, direction);
        });

        this.board = board;
    }
    get currentWord() {
        return this.path.map(letter => letter.value).join('');
    }
    get endOfPath() {
        return this.path[this.path.length - 1];
    }
    get startOfPath() {
        return this.path[0];
    }
    get length() {
        return this.path.length;
    }
    // get directions() {

    // }
    get coordinates() {
        return this.path.map(letter => letter.coordinates);
    }
    equals(path) {
        return path.length === this.length && path.every((letter, i) => letter === this.path[i]);
        // return path.length === this.length && path.reduce((equal, letter, i) => equal && letter === this.path[i], true);
    }
    includes(letter) {
        return this.path.includes(letter);
    }
    some(cb) {
        return this.path.some(cb);
    }
    every(cb) {
        return this.path.every(cb);
    }
    move(...directions) {
        if (!this.board.some(row => row.includes(this.path[0]))) throw new Error('must start before moving');
        if (directions.length === 1 && Array.isArray(directions[0])) directions = directions[0];
        directions.forEach(direction => {
            let nextLetter;
            if (direction instanceof Letter) nextLetter = direction;
            else {
                if (typeof direction === 'object') {

                    let { x, y } = direction;

                    if ((!x && x !== 0) || (!y && y !== 0)) throw new Error('must provide both x and y coordinates');
                    if ((x < 0 || x >= this.board[0].length) || (y < 0 || y >= this.board.length)) throw new Error('invalid destination not on board: ' + x + ' ' + y);

                    nextLetter = this.board[y][x];


                } else if (typeof direction === 'string') {

                    if (!statics.validDirections.includes(direction)) throw new Error('must specify legitimate direction');

                    nextLetter = this.endOfPath[direction];

                    if (!nextLetter) throw new Error('invalid direction from current position');

                } else throw new Error('required Letter, Object, or String, received: ' + typeof direction);
            }

            if (nextLetter === this.startOfPath) throw new Error('cannot move to beginning of path');
            else if (this.path.includes(nextLetter)) {
                this.path = this.path.slice(0, this.path.indexOf(nextLetter));
                return this;
            }
            else if (!this.endOfPath.adjacentLetterObjects.some(letter => letter.coordinates.x === nextLetter.coordinates.x && letter.coordinates.y === nextLetter.coordinates.y)) throw new Error('invalid destination');

            this.path.push(nextLetter);
        });
        return this;
    }
}

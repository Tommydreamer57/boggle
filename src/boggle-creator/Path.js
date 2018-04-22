import Letter from './Letter';
import statics from './statics';

export default class Path {
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
    move(...directions) {
        if (!this.board.some(row => row.includes(this.path[0]))) throw new Error('must start before moving');
        if (directions.length === 1 && Array.isArray(directions[0])) directions = directions[0];
        directions.forEach(direction => {
            let nextLetter;
            if (typeof direction === 'object') {

                let { x, y } = direction;

                if ((!x && x !== 0) || (!y && y !== 0)) throw new Error('must provide both x and y coordinates');
                if ((x < 0 || x >= this.board[0].length) || (y < 0 || y >= this.board.length)) throw new Error('invalid destination not on board: ' + x + ' ' + y);

                nextLetter = this.board[y][x];

                // if (this.path[0] === nextLetter) return this.resetPath();
                if (this.path.includes(nextLetter)) {
                    this.path = this.path.slice(0, this.path.indexOf(nextLetter));
                    return this;
                }
                if (!this.path[this.path.length - 1].adjacentLetterObjects.some(letter => letter.coordinates.x === x && letter.coordinates.y === y)) throw new Error('invalid destination: ' + x + ' ' + y);

            } else {

                if (!statics.validDirections.includes(direction)) throw new Error('must specify legitimate direction');

                nextLetter = this.path[this.path.length - 1][direction];

                if (!nextLetter) throw new Error('invalid direction from current position');
                if (this.path.includes(nextLetter)) throw new Error('letter already used: ' + nextLetter.value);

            }
            nextLetter && this.path.push(nextLetter);
        });
        return this;
    }
}

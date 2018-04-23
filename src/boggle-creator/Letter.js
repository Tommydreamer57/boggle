import statics from './statics';

export default class Letter {
    static default = {
        value: '',
        coordinates: { x: -1, y: -1 },
        adjacentLetterObjects: [this],
        adjacentLetters: [''],
        up: this,
        upRight: this,
        right: this,
        downRight: this,
        down: this,
        downLeft: this,
        left: this,
        upLeft: this
    }
    constructor(val, previousLetters = []) {
        if (!val) val = statics.getRandomLetter(previousLetters.map(letter => letter.value));
        val = val[0].toUpperCase() + val.slice(1).toLowerCase();
        this.value = val;
        this.coordinates = {};
    }
    get adjacentLetterObjects() {
        const letters = [];
        for (let prop in this) {
            if (statics.validDirections.includes(prop) && this[prop]) {
                letters.push(this[prop]);
            }
        }
        return letters;
    }
    get adjacentLetters() {
        return this.adjacentLetterObjects.map(letter => letter.value);
    }
}

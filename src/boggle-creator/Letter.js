import statics from './statics';

export default class Letter {
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

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Boggle from '../../boggle-creator';
import Left from './Left/Left';
import Right from './Right/Right';

const defaultDimension = 5;

export default class Play extends Component {
    constructor() {
        super();
        this.state = {
            boggle: new Boggle(defaultDimension),
            dimension: defaultDimension,
            input: '',
            words: [],
            oxfordValidations: [],
            cache: [],
            validating: false
        }
        this.ctrl = false;
    }
    componentDidMount() {
        let { joinedGame } = this.props;
        let { board } = joinedGame
        if (!board.length) board = [
            ["", "", "", "", ""],
            ["", "", "", "", ""],
            ["", "G", "L", "", ""],
            ["O", "G", "", "E", ""],
            ["B", "", "", "", ""],
        ];
        const boggle = new Boggle(board);
        this.setState({ boggle });
        console.log(boggle);

        this.handleChange('input', { target: { value: "BOGGLE" } });
        function keyDown(e) {
            if (e.key === 'Control' || e.metaKey) this.ctrl = true;
            if (e.key === 'Enter' && this.ctrl) return this.validateWords.call(this);
            if (e.key === 'Enter') this.addWord.call(this, this.state.input);
        }
        function keyUp(e) {
            if (e.key === 'Control' || e.metaKey) this.ctrl = false;
        }
        window.addEventListener('keydown', keyDown.bind(this));
        window.addEventListener('keyup', keyUp.bind(this));
        axios.get('/api/words').then(response => {
            const cache = response.data;
            this.setState({ cache });
        });
    }
    resetBoard(dimension = defaultDimension) {
        console.log(arguments);
        const boggle = new Boggle(dimension);
        const input = '';
        const words = [];
        this.setState({
            boggle,
            input,
            words,
            dimension
        });
    }
    handleChange(prop, e) {
        console.log(prop, e.target.value);
        let value = e.target.value;
        if (prop === 'input') value = value.toUpperCase().trim();
        this.setState({
            [prop]: value
        })
        if (prop === 'input') {
            const validations = this.state.boggle.validate(value);
            const word = {
                value,
                validations
            };
            console.log(word);
            this.updatePath(word);
        }
    }
    addWord(word, reset) {
        if (!word) return;
        word = word.toUpperCase();
        const update = {};
        if (reset) {
            update.boggle = this.state.boggle;
            update.boggle.start(0, 0);
        } else {
            update.input = '';
        }
        if (!this.state.words.some(obj => obj.value === word)) {
            const validations = this.state.boggle.validate(word);
            const newWord = {
                value: word,
                validations
            }
            update.words = [newWord, ...this.state.words];
        }
        this.setState({ ...update });
        this.updatePath();
    }
    validateWords() {
        let { words, oxfordValidations, cache, validating } = this.state;

        // PREVENT FREQUENT REQUESTS
        if (validating) return;

        words = words.filter(word => {
            let valid = word.validations.length;
            let tested = cache.some(validation => validation.value.toUpperCase() === word.value.toUpperCase());
            return valid && !tested;
        }).map(word => word.value);

        this.setState({ validating: true });

        axios.post('/api/validate', { words }).then(response => {
            console.log(response.data);
            cache = [...cache, ...response.data];
            oxfordValidations = cache;
            setTimeout(() => this.setState({ cache, oxfordValidations, validating: false }), 500);
        }).catch(err => {
            setTimeout(() => this.setState({ validating: false }), 500);
        });
    }
    resetValidations() {
        this.setState({
            oxfordValidations: []
        })
    }
    updatePath(word) {
        console.log(word);
        const { boggle } = this.state;
        const { path } = boggle;
        let input = word && word.value ? word.value.toUpperCase() : '';
        if (!word || !input) {
            input = '';
            boggle.resetPath();
        } else {
            const { validations } = word;
            if (!validations.length) {
                input = '';
                boggle.resetPath();
                return;
            }
            let index = validations.indexOf(path);
            boggle.path = word.validations[index + 1] || word.validations[0];
            input = boggle.path.map(letter => letter.value.toUpperCase()).join('');
        }
        console.log(input);
        this.setState({
            boggle,
            input
        })
    }
    handleClick(coordinates, e) {
        console.log(coordinates)
        let { boggle, input } = this.state;
        const { board, path } = boggle;
        const { x, y } = coordinates;
        const destination = board[y][x]

        const available = path.includes(destination) || path[path.length - 1].adjacentLetterObjects.includes(destination);

        if (!available) boggle.start(coordinates);
        else boggle.move(coordinates);

        input = boggle.path.map(letter => letter.value.toUpperCase()).join('');

        this.setState({
            ...this.state,
            input
        });
    }
    render() {
        const { boggle, words, oxfordValidations, validating } = this.state;
        const { board, path, dimensions } = boggle;
        const { x: size } = dimensions;
        console.log(this.state);

        const mappedWords = words.map((word, i) => {
            let selected = word.validations.includes(path);
            let valid = word.validations.length > 0;
            let tested = false;
            let defined = false;
            let oxfordValidation = oxfordValidations.find(validation => validation.value.toUpperCase() === word.value.toUpperCase());
            if (oxfordValidation && valid) {
                tested = true
                defined = oxfordValidation.defined;
            }
            return {
                ...word,
                selected,
                valid,
                tested,
                defined
            }
        });

        const untestedWords = [];
        const definedWords = [];
        const undefinedWords = [];
        const invalidWords = [];

        mappedWords.forEach(word => {
            if (!word.valid) return invalidWords.push(word);
            if (!word.tested) return untestedWords.push(word);
            if (!word.defined) return undefinedWords.push(word);
            if (word.defined) return definedWords.push(word);
        });

        const wordsToDisplay = [...untestedWords, ...definedWords, ...undefinedWords, ...invalidWords];

        const leftMethods = {
            resetBoard: this.resetBoard.bind(this, defaultDimension),
            handleDimensionChange: this.handleChange.bind(this, 'dimension'),
            onKeyDown: (e) => { e.key === 'Enter' ? this.resetBoard.call(this, this.state.dimension) : null },
            updateBoard: this.resetBoard.bind(this, this.state.dimension),
            handleClick: this.handleClick.bind(this),
            updatePath: this.updatePath.bind(this),
            addWord: this.addWord.bind(this, path.map(letter => letter.value).join(''), true)
        }
        const leftData = {
            dimension: this.state.dimension,
            board,
            path
        }
        const rightMethods = {
            handleInputChange: this.handleChange.bind(this, 'input'),
            onKeyDown: (e) => { e.key === 'Enter' ? this.addWord.call(this, this.state.input) : null },
            addWord: this.addWord.bind(this, this.state.input),
            updatePath: this.updatePath.bind(this),
            validateWords: this.validateWords.bind(this),
            resetValidations: this.resetValidations.bind(this)
        }
        const rightData = {
            input: this.state.input.toUpperCase(),
            validating,
            words: wordsToDisplay,
            path
        }

        return (
            <div className="Play" >
                <Left
                    methods={leftMethods}
                    data={leftData}
                />
                <div id="divider" />
                <Right
                    methods={rightMethods}
                    data={rightData}
                />
            </div>
        );
    }
}

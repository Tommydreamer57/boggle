import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Boggle from '../../boggle-creator';
import Left from './Left/Left';
import Right from './Right/Right';

export default class Play extends Component {
    static defaultDimension = 5
    constructor(props) {
        super(props);

        let { joinedGame, match, joinGame, registerHistory, history, clearJoinedGame } = props;
        let { dimension } = joinedGame;
        let { params } = match;
        let { gameid } = params;

        registerHistory({ history, params });

        const board = [
            ["", "", "", "", ""],
            ["", "", "", "", ""],
            ["", "G", "L", "", ""],
            ["O", "G", "", "E", ""],
            ["B", "", "", "", ""]
        ];

        this.state = {
            boggle: new Boggle(board),
            dimension: this.defaultDimension,
            input: '',
            words: [],
            oxfordValidations: [],
            cache: [],
            validating: false
        };

        this.ctrl = false;
    }
    registerChanges(props, value) {
        let { update } = this;

    }
    componentDidMount() {
        this.handleChange('input', { target: { value: "BOGGLE" } });
        let keyDown = (e) => {
            if (e.key === 'Control' || e.metaKey) this.ctrl = true;
            if (e.key === 'Enter' && this.ctrl) return this.validateWords.call(this);
            if (e.key === 'Enter') this.addWord.call(this, this.state.input);
        }
        let keyUp = (e) => {
            if (e.key === 'Control' || e.metaKey) this.ctrl = false;
        }
        window.addEventListener('keydown', keyDown);
        window.addEventListener('keyup', keyUp);
        axios.get('/api/words').then(response => {
            const cache = response.data;
            this.setState({ cache });
        });
    }
    handleChange(prop, e) {
        // console.log(prop, e.target.value);
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
            // console.log(word);
            this.updatePath(word);
        }
    }
    addWord(words, reset, boggle) {
        if (!words) return;
        if (!Array.isArray(words)) words = [words];
        if (!(boggle instanceof Boggle)) boggle = this.state.boggle;
        console.log(words);
        
        const update = {
            boggle,
            words: [...this.state.words]
        };
        if (reset) {
            update.boggle.startPath(0, 0);
        } else {
            update.input = '';
        }
        words.forEach(word => {
            word = word.toUpperCase();
            if (!this.state.words.some(obj => obj.value === word)) {
                const validations = boggle.validate(word);
                const newWord = {
                    value: word,
                    validations
                }
                update.words.unshift(newWord);
            }
        });
        console.log(update)
        // this.setState({ ...update });
        this.updatePath(null, update);
    }
    validateWords() {
        let { words, oxfordValidations, cache, validating } = this.state;

        // PREVENT FREQUENT REQUESTS
        if (validating) return;

        const filteredWords = words.filter(word => {
            let valid = word.validations.length;
            let tested = cache.some(validation => validation.value.toUpperCase() === word.value.toUpperCase());
            return valid && !tested;
        }).map(word => word.value);

        this.setState({ validating: true });


        let request;

        if (filteredWords.length) request = axios.post('/api/validate', { words: filteredWords });

        else request = new Promise(resolve => setTimeout(resolve.bind(null, { data: [] }), 0));

        request.then(response => {
            console.log(response.data);
            cache = [...cache, ...response.data];
            oxfordValidations = cache.filter(cachedWord => words.some(word => word.value.toUpperCase() === cachedWord.value.toUpperCase()));
            setTimeout(() => this.setState({ cache, oxfordValidations, validating: false }), 500);
        }).catch(err => {
            console.log(err);
            setTimeout(() => this.setState({ validating: false }), 500);
        });
    }
    resetValidations() {
        this.setState({
            oxfordValidations: []
        })
    }
    updatePath(word, update) {
        if (!update || !(update.boggle instanceof Boggle)) update = this.state;
        const { boggle } = update;
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
        // console.log(input);
        this.setState({
            ...update,
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

        if (!available) boggle.startPath(coordinates);
        else boggle.move(coordinates);

        input = boggle.path.map(letter => letter.value.toUpperCase()).join('');

        this.setState({
            ...this.state,
            input
        });
    }
    render() {
        const { leftMethods, rightMethods } = this;
        const { boggle, words, oxfordValidations, validating, dimension } = this.state;
        const { board, path, dimensions } = boggle;
        const { x: size } = dimensions;
        const { joinedGame, match } = this.props;
        const { startTime } = joinedGame;
        const { gameid } = match.params;
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


        const leftData = {
            dimension,
            board,
            path,
            gameid,
            startTime
        }
        const rightData = {
            input: this.state.input.toUpperCase(),
            validating,
            words: wordsToDisplay,
            path,
            gameid
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

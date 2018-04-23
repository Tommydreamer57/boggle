import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Boggle from '../../boggle-creator/Boggle';
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

        const boggle = new Boggle(board);
        const path = Boggle.Path.default;

        this.state = {
            boggle,
            path,
            dimension: this.defaultDimension,
            input: '',
            words: [],
            oxfordValidations: [],
            cache: [],
            validating: false
        };

        this.ctrl = false;
    }
    componentDidMount() {
        let keyDown = (e) => {
            if (e.key === 'Control' || e.metaKey) this.ctrl = true;
            if (e.key === 'Enter' && this.ctrl) return this.validateWords.call(this);
            if (e.key === 'Enter') this.addWords.call(this, this.state.input);
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
    addWords(words) {
        if (!words) return;
        if (!Array.isArray(words)) words = [words];
        console.log(words);

        this.setState((state) => {
            let update = {
                ...state,
                path: Boggle.Path.default,
                words: [...state.words],
                input: ''
            };
            words.forEach(word => {
                word = word.toUpperCase();
                if (!state.words.some(obj => obj.value === word)) {
                    const validations = state.boggle.validate(word);
                    const newWord = {
                        value: word,
                        validations
                    }
                    update.words.unshift(newWord);
                }
            });
            console.log(update)
            return update;
        });
        this.updatePath();
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
    updatePath(word) {
        this.setState((state) => {
            let { boggle, path } = state;
            let input = word && word.value ? word.value.toUpperCase() : '';
            if (!word || !input) {
                input = '';
                path = Boggle.Path.default;
            } else {
                const { validations } = word;
                if (!validations.length) {
                    input = '';
                    path = Boggle.Path.default;
                }
                else {
                    let index = validations.findIndex(validation => validation.reduce((pass, valid, i) => pass && valid === path.path[i], true));
                    path = boggle.createPath(word.validations[index + 1] || word.validations[0]);
                    input = path.path.map(letter => letter.value.toUpperCase()).join('');
                }
            }
            return {
                ...state,
                boggle,
                path,
                input
            }
        });
    }
    handleClick(coordinates, e) {
        this.setState((state) => {
            let { boggle, path, input } = state;
            const { board } = boggle;
            const { x, y } = coordinates;
            const destination = board[y][x];

            if (path.startOfPath === destination) {
                path = Boggle.Path.default;
            } else if (path.path.includes(destination) || path.endOfPath.adjacentLetterObjects.includes(destination)) {
                console.log(coordinates);
                console.log(destination.coordinates);
                path.move(coordinates);
            } else {
                path = boggle.startPath(coordinates);
            }

            input = path.currentWord;

            return {
                ...state,
                path,
                input
            }
        });
    }
    render() {
        const { leftMethods, rightMethods } = this;
        const { boggle, path, words, oxfordValidations, validating, dimension } = this.state;
        const { board, dimensions } = boggle;
        const { x: size } = dimensions;
        const { joinedGame, match } = this.props;
        const { startTime } = joinedGame;
        const { gameid } = match.params;
        console.log(this.state);

        const mappedWords = words.map((word, i) => {
            let selected = word.validations.includes(path.path);
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
            path: path.path,
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

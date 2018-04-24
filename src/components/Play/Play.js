import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Boggle from '../../boggle-creator/Boggle';
import Left from './Left/Left';
import Right from './Right/Right';

export default class Play extends Component {
    static defaultDimension = 5
    constructor(props) {
        console.log(super(props));
        
        // DESTRUCTURING
        let { joinedGame, match, joinGame, registerHistory, history, clearJoinedGame } = props;
        let { dimension } = joinedGame;
        let { params } = match;
        let { gameid } = params;
        // REGISTER HISTORY IN APP
        registerHistory({ history, params });
        // CREATE BOARD
        const board = [
            ["", "", "", "", ""],
            ["", "", "", "", ""],
            ["", "G", "L", "", ""],
            ["O", "G", "", "E", ""],
            ["B", "", "", "", ""]
        ];
        // CREATE BOGGLE FROM BOARD
        const boggle = new Boggle(board);
        // INITIALIZE PATH
        const path = Boggle.Path.default;
        // INITIAL STATE
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
        // KEEP TRACK OF CTRL KEY
        this.ctrl = false;
        // KEEP TRACK OF CURRENT REQUESTS
        this.requests = [];
    }
    componentDidMount() {
        // LISTEN FOR `ENTER` & `CTRL ENTER`
        let keyDown = (e) => {
            if (e.key === 'Control' || e.metaKey) this.ctrl = true;
            if (e.key === 'Enter' && this.ctrl) return this.validateWords.call(this);
            if (e.key === 'Enter') this.addWords.call(this, this.state.input);
        }
        // LISTEN FOR `CTRL`
        let keyUp = (e) => {
            if (e.key === 'Control' || e.metaKey) this.ctrl = false;
        }
        window.addEventListener('keydown', keyDown);
        window.addEventListener('keyup', keyUp);
        // GET CACHE
        let request = axios.get('/api/words');
        request.then(response => {
            const cache = response.data;
            this.setState({ cache });
        });
        this.requests.push(request);
    }
    // componentWillUnmount() {
    //     this.requests.forEach(request => {
    //         request.cancel();
    //     });
    // }
    handleChange(prop, e) {
        let value = e.target.value;
        if (prop === 'input') {
            // TOUPPERCASE AND TRIM
            value = value.toUpperCase().trim();
            // ADD TO STATE
            this.setState({
                [prop]: value
            });
            // CREATE WORD OBJECT
            const validations = this.state.boggle.validate(value);
            const word = {
                value,
                validations
            };
            // UPDATE PATH WITH WORD OBJECT & VALIDATIONS
            this.updatePath(word);
        }
    }
    sortWords(words) {
        let { oxfordValidations, path } = this.state;
        let mappedWords = words.map((word, i) => {
            let selected = word.validations.some(validation => path.equals(validation));
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
            if (!word.valid) invalidWords.push(word);
            else if (!word.tested) untestedWords.push(word);
            else if (!word.defined) undefinedWords.push(word);
            else if (word.defined) definedWords.push(word);
        });

        const wordsToDisplay = [...untestedWords, ...definedWords, ...undefinedWords, ...invalidWords];

        return {
            untestedWords,
            definedWords,
            undefinedWords,
            invalidWords,
            wordsToDisplay
        }
    }
    addWords(newWords) {
        if (!newWords) return;
        // ADD ONE OR MANY WORDS
        if (!Array.isArray(newWords)) newWords = [newWords];
        // NEEDS ACCESS TO PREVIOUS STATE
        this.setState((state) => {
            // UPDATE INPUT, PATH, WORDS
            let input = '';
            let path = Boggle.Path.default;
            let words = [
                // ADD NEW WORDS TO UPDATE
                ...newWords.reduce((wordsArr, wordString) => {
                    const value = wordString.toUpperCase();
                    if (!state.words.some(obj => obj.value === value)) {
                        const validations = state.boggle.validate(wordString);
                        const newWord = {
                            value,
                            validations
                        }
                        // UNSHIFT NEW WORDS ONTO BEGINNING OF WORDS ARRAY
                        wordsArr.unshift(newWord);
                    }
                    return wordsArr;
                }, []),
                // KEEP OLD WORDS
                ...state.words
            ];
            // RETURN UPDATED STATE
            return {
                path,
                input,
                words
            }
            // return update;
        });
        // UPDATE PATH WITH THE NEW CHANGES
        this.updatePath();
    }
    validateWords() {
        let { words, oxfordValidations, cache, validating } = this.state;

        // PREVENT FREQUENT REQUESTS
        if (validating) return;

        // REMOVE CACHED WORDS FROM REQUEST
        const filteredWords = words.filter(word => {
            let valid = word.validations.length;
            let tested = cache.some(validation => validation.value.toUpperCase() === word.value.toUpperCase());
            return valid && !tested;
        }).map(word => word.value);

        // FOR ANIMATION'S SAKE
        this.setState({ validating: true });

        // CREATE REQUEST
        let request;

        // IF THERE ARE NON-VALIDATED WORDS, SEND REQUEST TO SERVER
        if (filteredWords.length) request = axios.post('/api/validate', { words: filteredWords });

        // OTHERWISE CREATE NEW PROMISE THAT CAN STILL INVOKE .THEN CALLBACKS    
        else request = new Promise(resolve => setTimeout(resolve.bind(null, { data: [] }), 0));

        request.then(response => {
            console.log(response.data);
            // CACHE ALL NEW WORDS
            cache = [...cache, ...response.data];
            // ONLY SET INPUTTED WORDS INTO OXFORD VALIDATIONS (FOR ANIMATION'S SAKE)
            oxfordValidations = cache.filter(cachedWord => words.some(word => word.value.toUpperCase() === cachedWord.value.toUpperCase()));
            // ALLOW ANIMATION TO RUN 1/2 SECOND LONGER
            setTimeout(() => this.setState({ cache, oxfordValidations, validating: false }), 500);
        }).catch(err => {
            console.log(err);
            setTimeout(() => this.setState({ validating: false }), 500);
        });
        this.requests.push(request);
    }
    resetValidations() {
        // RESET OXFORDVALIDATIONS BUT KEEP CACHE
        this.setState({
            oxfordValidations: []
        })
    }
    updatePath(word, reset = false) {
        // UPDATE PATH IS CALLED AFTER SETSTATE IN OTHER FUNCTIONS
        // THEREFORE NEEDS ACCESS TO PREVIOUS STATE THROUGH CALLBACK
        this.setState((state) => {
            let { boggle, path } = state;
            let input = word && word.value ? word.value.toUpperCase() : '';
            // IF EITHER NO WORD OR NO INPUT, SET PATH TO DEFAULT (EMPTY)
            if (!word || !input) {
                input = '';
                path = Boggle.Path.default;
            } else {
                const { validations } = word;
                // ONLY UPDATE INPUT IF RESET IS TRUE
                if (reset) input = '';
                // IF NO VALIDATIONS, RESET PATH TO DEFAULT (EMPTY)
                if (!validations.length) {
                    path = Boggle.Path.default;
                }
                // IF VALIDATIONS.LENGTH, TOGGLE NEXT VALIDATION
                else {
                    // FIND INDEX OF CURRENT PATH IN WORD.VALIDATIONS
                    let index = validations.findIndex(validation => validation.reduce((pass, valid, i) => pass && valid === path.path[i], true));
                    // TOGGLE NEXT INDEX OR FIRST INDEX IN VALIDATIONS
                    let nextPath = validations[index + 1] || validations[0];
                    // CREATE PATH FROM PATH
                    path = boggle.createPath(nextPath);
                    input = path.path.map(letter => letter.value.toUpperCase()).join('');
                }
            }
            // UPDATE PATH AND INPUT
            return {
                path,
                input
            }
        });
    }
    handleClick(coordinates, e) {
        // NEEDS ACCESS TO BOGGLE OBJECT -> MUST USE FUNCTIONAL SETSTATE
        this.setState((state) => {
            let { boggle, path, input } = state;
            const { board } = boggle;
            const { x, y } = coordinates;
            // DESTINATION IS THE CLICKED ON LETTER
            const destination = board[y][x];

            // RESET PATH WHEN FIRST LETTER IS CLICKED
            if (path.startOfPath === destination) {
                path = Boggle.Path.default;
            }
            // IF CLICKED LETTER IS ACCESSIBLE THROUGH CURRENT PATH
            else if (path.path.includes(destination) || path.endOfPath.adjacentLetterObjects.includes(destination)) {
                console.log(coordinates);
                console.log(destination.coordinates);
                // MOVE THE PATH TO THE COORDINATES
                path.move(coordinates);
            }
            // IF CLICKED ON LETTER IS NOT ACCESSIBLE THROUGH CURRENT PATH
            else {
                // START NEW PATH
                path = boggle.startPath(coordinates);
            }

            // UPDATE INPUT TO PATH VALUE
            input = path.currentWord;

            // UPDATE PATH AND INPUT
            return {
                path,
                input
            }
        });
    }
    render() {
        // DESTRUCTURE
        const { leftMethods, rightMethods } = this;
        const { boggle, path, words, oxfordValidations, validating, dimension } = this.state;
        const { board, dimensions } = boggle;
        const { x: size } = dimensions;
        const { joinedGame, match } = this.props;
        const { startTime } = joinedGame;
        const { gameid } = match.params;

        console.log(this.state);
        console.log(this.props);

        const { wordsToDisplay } = this.sortWords(words);

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

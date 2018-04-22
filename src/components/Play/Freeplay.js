import React, { Component } from 'react';
import axios from 'axios';
import Boggle from '../../boggle-creator';
import Play from './Play';
import Left from './Left/Left';
import Right from './Right/Right';

export default class Freeplay extends Play {
    get leftMethods() {
        return {
            resetBoard: this.resetBoard.bind(this, this.defaultDimension),
            handleDimensionChange: this.handleChange.bind(this, 'dimension'),
            onKeyDown: (e) => { e.key === 'Enter' ? this.resetBoard.call(this, this.state.dimension) : null },
            updateBoard: this.resetBoard.bind(this, this.state.dimension),
            handleClick: this.handleClick.bind(this),
            updatePath: this.updatePath.bind(this),
            addWord: this.addWord.bind(this, this.state.boggle.currentWord, true)
        }
    }
    get rightMethods() {
        return {
            handleInputChange: this.handleChange.bind(this, 'input'),
            onKeyDown: (e) => { e.key === 'Enter' ? this.addWord.call(this, this.state.input) : null },
            addWord: this.addWord.bind(this, this.state.input),
            updatePath: this.updatePath.bind(this),
            validateWords: this.validateWords.bind(this),
            resetValidations: this.resetValidations.bind(this)
        }
    }
    resetBoard(dimension = this.defaultDimension) {
        // console.log(arguments);
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
}

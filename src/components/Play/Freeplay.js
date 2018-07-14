import React, { Component } from 'react';
import axios from 'axios';
import Boggle from '../../boggle-creator/Boggle';
import Play from './Play';
import Left from './Left/Left';
import Right from './Right/Right';

// import { connect } from 'react-redux';
import { actionCreators, connectAll } from '../../ducks/actions';

class Freeplay extends Play {
    get leftMethods() {
        return {
            resetBoard: this.resetBoard.bind(this, this.defaultDimension),
            handleDimensionChange: this.handleChange.bind(this, 'dimension'),
            onKeyDown: (e) => { e.key === 'Enter' ? this.resetBoard.call(this, this.state.dimension) : null },
            updateBoard: this.resetBoard.bind(this, this.state.dimension),
            handleClick: this.handleClick.bind(this),
            updatePath: this.updatePath.bind(this),
            addWords: this.addWords.bind(this, this.state.path.currentWord, true)
        }
    }
    get rightMethods() {
        return {
            handleInputChange: this.handleChange.bind(this, 'input'),
            onKeyDown: (e) => { e.key === 'Enter' ? this.addWords.call(this, this.state.input) : null },
            addWords: this.addWords.bind(this, this.state.input),
            updatePath: this.updatePath.bind(this),
            validateWords: this.validateWords.bind(this),
            resetValidations: this.resetValidations.bind(this)
        }
    }
    componentDidMount() {
        super.componentDidMount();
        this.handleChange('input', { target: { value: "BOGGLE" } });
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

export default connectAll(Freeplay);

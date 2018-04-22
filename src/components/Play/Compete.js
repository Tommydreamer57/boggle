import React, { Component } from 'react';
import axios from 'axios';
import Boggle from '../../boggle-creator';
import Play from './Play';
import Left from './Left/Left';
import Right from './Right/Right';

export default class Compete extends Play {
    get leftMethods() {
        return {
            handleDimensionChange: this.handleChange.bind(this, 'dimension'),
            onKeyDown: (e) => { e.key === 'Enter' ? this.resetBoard.call(this, this.state.dimension) : null },
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
    componentWillReceiveProps({ joinedGame, user }) {
        console.log(user);
        let { boggle } = this.state;
        if (joinedGame.board.length) boggle = new Boggle(joinedGame.board);
        console.log(boggle);
        if (user.words) this.addWord(user.words, true, boggle);
        else this.setState({ boggle });
    }
    componentWillUnmount() {
        const { socket, user, match } = this.props;
        const { params } = match;
        const { gameid } = params;
        const words = this.state.words.map(word => word.value);
        console.log(user, words);
        socket.emit('save words', { gameid, user, words });
    }
}

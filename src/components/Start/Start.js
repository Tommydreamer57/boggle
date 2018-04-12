import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import User from '../User/User';

export default class Start extends Component {
    constructor() {
        super();
    }
    componentDidMount() {
        this.props.storeHistory(this.props.history);
    }
    render() {
        const { startGame, user, handleUserChange } = this.props;
        return (
            <div className="Start" >
                <User
                    user={user}
                    handleUserChange={handleUserChange}
                />
                <button onClick={startGame} >START</button>
            </div>
        )
    }
}

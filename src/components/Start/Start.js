import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Start extends Component {
    constructor() {
        super();
    }
    componentDidMount() {
        this.props.storeHistory(this.props.history);
    }
    render() {
        const { startGame, user, handleUserChange, joinedGame, handleGameChange } = this.props;
        return (
            <div className="Start" >
                <div className="input-wrapper" >
                    <h4>Your Name</h4>
                    <input
                        type="text"
                        value={user.name}
                        onChange={handleUserChange.bind(null, 'name')}
                    />
                </div>
                <div className="input-wrapper" >
                    <h4>Board Size</h4>
                    <input
                        type="number"
                        value={joinedGame.dimension}
                        onChange={handleGameChange.bind(null, 'dimension')}
                    />
                </div>
                <button className="start-game" onClick={startGame} >START</button>
            </div>
        )
    }
}

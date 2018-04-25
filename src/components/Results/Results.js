import React, { Component } from 'react';

export default class Results extends Component {
    constructor() {
        super();
    }
    componentDidMount() {
        let { gameid } = this.props.match.params;
        if (!this.props.joinedGame.board.length) {
            this.props.socket
        }
    }
    render() {
        let { joinedGame } = this.props;
        let { _id, players, user, date, startTime, endTime, winner } = joinedGame;
        console.log(this.props);
        return (
            <div className="Results">
                <h1>{_id}</h1>
                {
                    players.sort((a, b) => {
                        if (a.points !== b.points) return a.points < b.points;
                        else return a.words.length < b.words.length
                    }).map(player => {
                        return (
                            <div className={'player ' + player.winner ? 'winner' : ''} >
                                <h2>{player.name} - {player.points}</h2>
                                {player.words.join(' ')}
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

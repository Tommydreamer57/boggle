import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../Modal/Modal';

export default class Join extends Component {
    constructor() {
        super();
        this.state = {
            modal: false,
            selectedGame: -1
        }
    }
    affirm() {
        console.log(`selecting ${this.state.selectedGame}`);
        this.props.joinGame.call(null, this.state.selectedGame._id);
    }
    toggleModal(selectedGame) {
        console.log(`toggling modal, ${this.state.selectedGame}`);
        this.setState({
            modal: !this.state.modal,
            selectedGame
        });
    }
    componentDidMount() {
        const { mapHistoryToApp, match, history } = this.props;
        const { params } = history;
        mapHistoryToApp({ history, params });
        this.props.socket.emit('find games');
    }
    render() {
        const { currentGames, joinGame, history, user, handleUserChange } = this.props;
        const { toggleModal } = this;
        const { selectedGame, modal } = this.state;
        console.log(this.props);
        return (
            <div className="Join" >
                <Modal
                    type="select"
                    style={{ zIndex: modal ? 1 : -1 }}
                    className={`link ${modal ? 'start' : 'end'}`}
                    text={["CANCEL", `JOIN GAME ${selectedGame._id}`]}
                    to={['', '']}
                    clicks={[toggleModal.bind(this, -1), joinGame.bind(null, selectedGame._id)]}
                />
                <input
                    type="text"
                    value={user.name}
                    placeholder="Please enter your name"
                    onChange={handleUserChange.bind(null, 'name')}
                />
                <div className="games">
                    {
                        currentGames.length ?
                            currentGames.map(game => (
                                <button key={`GAME ${game._id}`} className="game" onClick={toggleModal.bind(this, game)} >
                                    GAME: {game.user.name} - BOARD: {game.dimension} x {game.dimension} - PLAYERS: {game.players.length}
                                </button>
                            ))
                            :
                            <h4>There are no current games</h4>
                    }
                </div>
            </div>
        )
    }
}

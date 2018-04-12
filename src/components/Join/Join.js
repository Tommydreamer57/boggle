import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../Modal/Modal';
import User from '../User/User';

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
        this.props.joinGame.call(null, this.state.selectedGame);
    }
    toggleModal(selectedGame) {
        console.log(`toggling modal, ${this.state.selectedGame}`);
        this.setState({
            modal: !this.state.modal,
            selectedGame
        });
    }
    componentDidMount() {
        this.props.storeHistory(this.props.history);
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
                    text={["CANCEL", `JOIN GAME ${selectedGame}`]}
                    to={['', '']}
                    clicks={[toggleModal.bind(this, -1), joinGame.bind(null, selectedGame)]}
                />
                <User
                    user={user}
                    handleUserChange={handleUserChange}
                />
                <div className="games">
                    {
                        currentGames.map(game => (
                            <div key={`GAME ${game}`} className="game" onClick={toggleModal.bind(this, game)} >
                                GAME {game}
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }
}

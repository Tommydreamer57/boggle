import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
// VIEWS
import Landing from './components/Landing/Landing';
import Start from './components/Start/Start';
import Join from './components/Join/Join';
import Wait from './components/Wait/Wait';
import Play from './components/Play/Play';
// COMPONENTS
import Modal from './components/Modal/Modal';
// BOGGLE
import { boardCreator } from './boggle-creator';
// SOCKET
import io from 'socket.io-client';
// CSS
import './App.css';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      currentGames: [],
      joinedGame: {
        dimension: 4,
        board: []
      },
      user: {
        name: ''
      }
    }
    const socket = io('/');
    socket.on('games found', this.receiveGames.bind(this));
    socket.on('game joined', this.handleJoinedGame.bind(this));
    socket.on('game started', this.handleJoinedGame.bind(this));
    this.socket = socket;
  }
  storeHistory(history) {
    this.history = history;
  }
  receiveGames({ currentGames }) {
    console.log(currentGames);
    this.setState({
      currentGames
    });
  }
  joinGame(game) {
    const { user } = this.state;
    this.socket.emit('join game', { game, user });
  }
  handleJoinedGame({ joinedGame }) {
    console.log(joinedGame);
    this.history.push(`/wait/${joinedGame._id}`);
    this.setState({
      joinedGame
    })
  }
  startGame() {
    const { joinedGame, user } = this.state
    const { dimension } = joinedGame;
    const board = boardCreator(dimension);
    const players = [user];
    const game = {
      board,
      dimension,
      user,
      players
    }
    this.socket.emit('start game', { game, user });
  }
  enterGame() {
    const { _id } = this.state.joinedGame;
    this.history.push(`/play/${_id}`);
  }
  handleUserChange(prop, e) {
    this.setState({
      user: {
        ...this.state.user,
        [prop]: e.target.value
      }
    })
  }
  handleGameChange(prop, e) {
    if (prop === "dimension" && (e.target.value < 3 || e.target.value > 9)) return;
    this.setState({
      joinedGame: {
        ...this.state.joinedGame,
        [prop]: e.target.value
      }
    })
  }
  componentDidMount() {
    this.socket.emit('find games');
  }
  render() {
    console.log(this.state);
    const viewProps = {
      currentGames: this.state.currentGames,
      socket: this.socket,
      joinGame: this.joinGame.bind(this),
      storeHistory: this.storeHistory.bind(this),
      user: this.state.user,
      handleUserChange: this.handleUserChange.bind(this),
      joinedGame: this.state.joinedGame,
      handleGameChange: this.handleGameChange.bind(this),
      startGame: this.startGame.bind(this),
      enterGame: this.enterGame.bind(this)
    }
    return (
      <div className="App">
        <div id="background" />
        <div id="background-cover" />
        <Switch>
          {/* LANDING */}
          <Route exact path="/" render={(props) => [
            <Modal
              key="LINK"
              className="link start"
              text={["START GAME", "JOIN GAME", "FREE PLAY"]}
              to={["/start", "/join", "/play"]}
            />,
            <Landing {...props} {...viewProps} key="LANDING" />
          ]} />
          {/* START */}
          <Route path="/start" render={(props) => [
            <Modal
              key="LINK"
              className="link end"
              text="BACK"
              to="/"
            />,
            <Start {...props} {...viewProps} key="START" />
          ]} />
          {/* JOIN */}
          <Route path="/join" render={(props) => [
            <Modal
              key="LINK"
              className="link end"
              text="BACK"
              to="/"
            />,
            <Join {...props} {...viewProps} key="JOIN" />
          ]} />
          <Route path="/wait" render={(props) => [
            <Modal
              key="LINK"
              className="link end"
              text="EXIT"
              to="/join"
            />,
            <Wait {...props} {...viewProps} key="WAIT" />
          ]}
          />
          {/* PLAY */}
          <Route path="/play/:gameid" render={(props) => [
            <Modal
              key="LINK"
              className="link end"
              text="END GAME"
              to="/"
            />,
            <Play {...props} {...viewProps} key="PLAY" />,
            <Modal
              key="USERNAME"
              className="link username"
              text={this.state.user.name}
              type="display"
            />
            // <button className="link username"><a href="" >{this.state.user.name || ''}</a></button>
          ]} />
          {/* FREE PLAY */}
          <Route path="/play" render={(props) => [
            <Modal
              key="LINK"
              className="link end"
              text="END GAME"
              to="/"
            />,
            <Play {...props} {...viewProps} key="PLAY" />
          ]} />
        </Switch>
      </div>
    )
  }
}

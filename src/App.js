import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
// VIEWS
import Landing from './components/Landing/Landing';
import Start from './components/Start/Start';
import Join from './components/Join/Join';
import Wait from './components/Wait/Wait';
import Compete from './components/Play/Compete';
import Freeplay from './components/Play/Freeplay';
import Results from './components/Results/Results';
// COMPONENTS
import Modal from './components/Modal/Modal';
// BOGGLE
import Boggle from './boggle-creator/Boggle';
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
        board: [],
        startTime: new Date(Date.now())
      },
      user: {
        name: ''
      }
    }
    const socket = io('/');
    socket.on('games found', this.receiveGames.bind(this));
    socket.on('game joined', this.handleJoinedGame.bind(this));
    socket.on('already joined', this.handleAlreadyJoined.bind(this));
    socket.on('game created', this.handleJoinedGame.bind(this));
    socket.on('game started', this.handleStartedGame.bind(this));
    socket.on('game over', this.handleGameOver.bind(this));
    this.socket = socket;
  }
  registerHistory({ history, params }) {
    this.history = history;
    this.params = params;
  }
  receiveGames({ currentGames }) {
    console.log(currentGames);
    this.setState({
      currentGames
    });
  }
  joinGame(gameid) {
    const { user } = this.state;
    if (!user.name) return console.log('MUST ADD USER FIRST');
    this.socket.emit('join game', { gameid, user });
  }
  handleJoinedGame({ joinedGame }) {
    console.log(joinedGame);
    if (joinedGame.startTime) this.history.push(`/compete/${joinedGame._id}`);
    else this.history.push(`/wait/${joinedGame._id}`);
    this.setState({
      joinedGame
    });
  }
  handleAlreadyJoined({ joinedGame, user }) {
    console.log(joinedGame);
    console.log(user);
    if (joinedGame.startTime) this.history.push(`/compete/${joinedGame._id}`);
    else this.history.push(`/wait/${joinedGame._id}`);
    if (user.name !== this.state.user.name) user = this.state.user;
    this.setState({
      joinedGame,
      user
    });
  }
  clearJoinedGame() {
    this.setState({
      joinedGame: {
        dimension: 4,
        board: []
      }
    });
  }
  createGame() {
    const { joinedGame, user } = this.state
    const { dimension } = joinedGame;
    const board = Boggle.createBoard(dimension);
    const players = [user];
    const game = {
      board,
      dimension,
      user,
      players
    }
    console.log(game);
    this.socket.emit('create game', { game, user });
  }
  startGame() {
    const { _id: gameid } = this.state.joinedGame;
    this.socket.emit('start game', { gameid })
  }
  handleStartedGame({ startedGame }) {
    const { _id } = startedGame;
    this.history.push(`/play/${_id}`);
  }
  handleGameOver() {

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
    // if (this.params.gameid) this.socket.emit('join game', {})
  }
  render() {
    // console.log(this.state);
    const viewProps = {
      currentGames: this.state.currentGames,
      socket: this.socket,
      user: this.state.user,
      joinedGame: this.state.joinedGame,
      joinGame: this.joinGame.bind(this),
      registerHistory: this.registerHistory.bind(this),
      handleUserChange: this.handleUserChange.bind(this),
      handleGameChange: this.handleGameChange.bind(this),
      createGame: this.createGame.bind(this),
      startGame: this.startGame.bind(this),
      clearJoinedGame: this.clearJoinedGame.bind(this)
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
          {/* WAIT */}
          <Route path="/wait/:gameid" render={(props) => [
            <Modal
              key="LINK"
              className="link end"
              text="EXIT"
              to="/join"
            />,
            <Wait {...props} {...viewProps} key="WAIT" />
          ]} />
          {/* COMPETE */}
          <Route path="/compete/:gameid" render={(props) => [
            <Modal
              key="LINK"
              className="link end"
              text="END GAME"
              to="/"
            />,
            <Compete {...props} {...viewProps} key="COMPETE" />,
            <Modal
              key="USERNAME"
              className="link username"
              text={this.state.user.name}
              type="display"
            />
          ]} />
          {/* RESULTS */}
          <Route path="/results/:gameid" render={(props) => [
            <Modal
              key="LINK"
              className="link end"
              text="END GAME"
              to="/"
            />,
            <Results {...props} {...viewProps} key="RESULTS" />
          ]} />
          {/* FREEPLAY */}
          <Route path="/play" render={(props) => [
            <Modal
              key="LINK"
              className="link end"
              text="END GAME"
              to="/"
            />,
            <Freeplay {...props} {...viewProps} key="FREEPLAY" />
          ]} />
        </Switch>
      </div>
    )
  }
}

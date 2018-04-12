import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
// VIEWS
import Landing from './components/Landing/Landing';
import Start from './components/Start/Start';
import Join from './components/Join/Join';
import Play from './components/Play/Play';
// COMPONENTS
import Modal from './components/Modal/Modal';
// SOCKET
import io from 'socket.io-client';
// CSS
import './App.css';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      currentGames: [],
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
    this.socket.emit('join game', game);
  }
  handleJoinedGame(game) {
    console.log(game);
    this.history.push(`/play/${game}`);
  }
  startGame() {
    this.socket.emit('start game', this.user);
  }
  handleUserChange(prop, e) {
    this.setState({
      user: { [prop]: e.target.value }
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
      startGame: this.startGame.bind(this)
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
            <Landing
              {...props}
              {...viewProps}
              key="LANDING"
            />
          ]} />
          {/* START */}
          <Route path="/start" render={(props) => [
            <Modal
              key="LINK"
              className="link end"
              text="BACK"
              to="/"
            />,
            <Start
              {...props}
              {...viewProps}
              key="START"
            />
          ]} />
          {/* JOIN */}
          <Route path="/join" render={(props) => [
            <Modal
              key="LINK"
              className="link end"
              text="BACK"
              to="/"
            />,
            <Join
              {...props}
              {...viewProps}
              key="JOIN"
            />
          ]} />
          {/* PLAY */}
          <Route path="/play/:gameid" render={(props) => [
            <Modal
              key="LINK"
              className="link end"
              text="END GAME"
              to="/"
            />,
            <Play
              {...props}
              {...viewProps}
              key="PLAY"
            />
          ]} />
          {/* FREE PLAY */}
          <Route path="/play" render={(props) => [
            <Modal
              key="LINK"
              className="link end"
              text="END GAME"
              to="/"
            />,
            <Play
              {...props}
              {...viewProps}
              key="PLAY"
            />
          ]} />
        </Switch>
      </div>
    )
  }
}

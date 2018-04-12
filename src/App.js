import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import Landing from './components/Landing/Landing';
import Start from './components/Start/Start';
import Join from './components/Join/Join';
import Play from './components/Play/Play';
import './App.css';

function BackButton({ className, text, to }) {
  return (
    <button className={className} >
      <div className="link-shadow" />
      {
        Array.isArray(text) ?
          text.map((item, i) => (
            <Link key={`LINK ${item}`} to={to[i]} >
              {item}
            </Link>
          ))
          :
          <Link to={to} >
            {text}
          </Link>
      }
    </button>
  )
}

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <div id="background" />
        <div id="background-cover" />
        <Switch>
          {/* LANDING */}
          <Route exact path="/" render={(...props) => [
            <BackButton key="LINK" className="link start" text={["START GAME", "JOIN GAME", "FREE PLAY"]} to={["/start", "/join", "/play"]} />,
            <Landing {...props} key="LANDING" />
          ]} />
          {/* START */}
          <Route path="/start" render={(...props) => [
            <BackButton key="LINK" className="link end" text="BACK" to="/" />,
            <Start {...props} key="START" />
          ]} />
          {/* JOIN */}
          <Route path="/join" render={(...props) => [
            <BackButton key="LINK" className="link end" text="BACK" to="/" />,
            <Join {...props} key="JOIN" />
          ]} />
          {/* PLAY */}
          <Route path="/play" render={(...props) => [
            <BackButton key="LINK" className="link end" text="END GAME" to="/" />,
            <Play {...props} key="PLAY" />
          ]} />
        </Switch>
      </div>
    )
  }
}

import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import Play from './components/Play/Play';
import Landing from './components/Landing/Landing';
import './App.css';

export default class App extends Component {
  render() {
    return (
      <div className="App">

        <Switch>
          <Route exact path="/" render={(...props) => [
            <button key="LINK" className="link start" ><div className="link-shadow" /><Link to="/play" >START GAME</Link></button>,
            <Landing {...props} key="LANDING" />
          ]} />
          <Route path="/play" render={(...props) => [
            <button key="LINK" className="link end" ><div className="link-shadow" /><Link to="/" >END GAME</Link></button>,
            <Play {...props} key="PLAY" />
          ]} />
        </Switch>
      </div>
    )
  }
}

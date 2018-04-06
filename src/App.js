import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Boggle from './components/Boggle';

class App extends Component {
  constructor() {
    super();

    const boggle = new Boggle(6);

    this.state = {
      boggle,
      dimension: 6,
      input: '',
      words: []
    }

  }
  resetBoard(n) {
    console.log(arguments);
    const boggle = new Boggle(n || 6);
    this.setState({ boggle });
  }
  handleChange(prop, e) {
    this.setState({
      [prop]: e.target.value
    })
  }
  addWord(word, reset) {
    const update = {};
    if (reset) {
      update.boggle = this.state.boggle;
      update.boggle.start(0, 0);
    }
    else {
      update.input = '';
    }
    this.setState({
      words: [...this.state.words, word],
      ...update
    })
  }
  validateWords() {
    const { boggle, words } = this.state;
    const validations = [];
    words.forEach(word => {
      validations.push(boggle.validate(word));
    });
    console.log(validations);
  }
  handleClick(coordinates, e) {
    const { boggle } = this.state;
    const { board, path } = boggle;
    const { x, y } = coordinates;
    const destination = board[y][x]

    const available = path[path.length - 1].adjacentLetterObjects.includes(destination) && !path.includes(destination);

    if (!available) boggle.start(coordinates);
    else boggle.move(coordinates);

    this.setState(this.state);
  }
  render() {
    const { boggle, words } = this.state;
    const { board, path } = boggle;
    return (
      <div className="App">
        <div className="left">
        </div>
        <div className="center" >
          <button onClick={this.resetBoard.bind(this, 6)} >RESET BOARD</button>
          <input
            type='number'
            value={this.state.dimension}
            onChange={this.handleChange.bind(this, 'dimension')}
          />
          <button onClick={this.resetBoard.bind(this, this.state.dimension)} >UPDATE BOARD</button>
          <table id="board" >
            <tbody className="board" >
              {
                board.map((row, i) => (
                  <tr key={`Row: ${i}`} className="row" >
                    {
                      row.map(letter => {
                        let index = path.indexOf(letter) + 1;
                        let last = path[path.length - 1] === letter;
                        let used = path.includes(letter) && !last;
                        let available = path[path.length - 1].adjacentLetterObjects.includes(letter) && !used;
                        return (
                          <td
                            key={`Letter: X: ${letter.coordinates.x}, Y: ${letter.coordinates.y}`}
                            className="cell"
                            onClick={this.handleClick.bind(this, letter.coordinates)}
                          >
                            <div className={`letter ${used ? 'used' : ''} ${available ? 'available' : ''} ${last ? 'last' : ''}`} >
                              {
                                index ?
                                  <div className="index" >{index}</div>
                                  :
                                  null
                              }
                              {letter.value}
                            </div>
                          </td>
                        )
                      })
                    }
                  </tr>
                ))
              }
            </tbody>
          </table>
          <h3>
            {
              path.map(letter => letter.value)
            }
          </h3>
          <button onClick={this.addWord.bind(this, path.map(letter => letter.value).join(''), true)} >ADD WORD</button>
        </div>
        <div className="right">
          <h3>ADD WORDS HERE</h3>
          <input
            value={this.state.input}
            onChange={this.handleChange.bind(this, 'input')}
          />
          <button onClick={this.addWord.bind(this, this.state.input)} >ADD WORD</button>
          {
            words.map(word => (
              <h4>{word.toUpperCase()}</h4>
            ))
          }
          <button onClick={this.validateWords.bind(this)} >VALIDATE WORDS</button>
        </div>
      </div>
    );
  }
}

export default App;

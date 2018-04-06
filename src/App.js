import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Boggle from './components/Boggle';

class App extends Component {
  constructor() {
    super();

    const boggle = new Boggle(4);

    this.state = {
      boggle,
      dimension: 4,
      input: '',
      words: []
    }

  }
  resetBoard(dimension = 4) {
    console.log(arguments);
    const boggle = new Boggle(dimension);
    const input = '';
    const words = [];
    this.setState({
      boggle,
      input,
      words,
      dimension
    });
  }
  handleChange(prop, e) {
    console.log(prop, e.target.value);
    this.setState({
      [prop]: e.target.value
    })
    if (prop === 'input') {
      const value = e.target.value.toUpperCase();
      const validations = this.state.boggle.validate(value);
      const word = {
        value,
        validations
      };
      console.log(word);
      this.updatePath(word);
    }
  }
  addWord(word, reset) {
    if (!word) return;
    word = word.toUpperCase();
    const update = {};
    if (reset) {
      update.boggle = this.state.boggle;
      update.boggle.start(0, 0);
    } else {
      update.input = '';
    }
    if (!this.state.words.some(obj => obj.value === word)) {
      const validations = this.state.boggle.validate(word);
      word = {
        value: word,
        validations
      }
      update.words = [...this.state.words, word];
    }
    this.setState({ ...update });
    this.updatePath();
  }
  // validateWords() {
  //   const { boggle, words } = this.state;
  //   const validations = [];
  //   words.forEach(word => {
  //     validations.push(boggle.validate(word.value));
  //   });
  //   console.log(validations);
  // }
  updatePath(word) {
    console.log(word);
    const { boggle } = this.state;
    const { path } = boggle;
    let input = word && word.value ? word.value.toUpperCase() : '';
    if (!word || !input) {
      input = '';
      boggle.resetPath();
    } else {
      const { validations } = word;
      if (!validations.length) return;
      let index = validations.indexOf(path);
      boggle.path = word.validations[index + 1] || word.validations[0];
      input = boggle.path.map(letter => letter.value.toUpperCase()).join('');
    }
    console.log(input);
    this.setState({
      boggle,
      input
    })
  }
  handleClick(coordinates, e) {
    let { boggle, input } = this.state;
    const { board, path } = boggle;
    const { x, y } = coordinates;
    const destination = board[y][x]

    const available = path.includes(destination) || path[path.length - 1].adjacentLetterObjects.includes(destination);

    if (!available) boggle.start(coordinates);
    else boggle.move(coordinates);

    input = boggle.path.map(letter => letter.value.toUpperCase()).join('');

      this.setState({
        ...this.state,
        input
      });
  }
  render() {
    const { boggle, words } = this.state;
    const { board, path } = boggle;
    console.log(this.state);
    return (
      <div className="App" >
        <div className="left" >
          <div className="buttons" >
            <button onClick={this.resetBoard.bind(this, 6)} >RESET BOARD</button>
            <input
              type='number'
              min={3}
              max={9}
              value={this.state.dimension}
              onChange={this.handleChange.bind(this, 'dimension')}
              onKeyDown={e => e.key === 'Enter' ? this.resetBoard.call(this, this.state.dimension) : null}
            />
            <button onClick={this.resetBoard.bind(this, this.state.dimension)} >UPDATE BOARD</button>
          </div>
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
          <div class="buttons" >
            <button onClick={this.updatePath.bind(this)} >RESET PATH</button>
            <h3>
              {
                path.map(letter => letter.value.toUpperCase())
              }
            </h3>
            <button onClick={this.addWord.bind(this, path.map(letter => letter.value).join(''), true)} >ADD WORD</button>
          </div>
        </div>
        <div className="right">
          <div class="header" >
            <h3>ADD WORDS HERE</h3>
            <input
              value={this.state.input.toUpperCase()}
              onChange={this.handleChange.bind(this, 'input')}
              onKeyDown={e => e.key === 'Enter' ? this.addWord.call(this, this.state.input) : null}
            />
            <button onClick={this.addWord.bind(this, this.state.input)} >ADD WORD</button>
          </div>
          <div class="body" >
            {
              words.map(word => (
                <button
                  className={`word ${word.validations.length ? 'valid' : 'invalid'}`}
                  onClick={this.updatePath.bind(this, word)}
                >
                  {word.value.toUpperCase() + ' (' + word.validations.length + ')'}
                  {word.validations.indexOf(path) + 1 ? ' - (' + (word.validations.indexOf(path) + 1) + ')' : ''}
                </button>
              ))
            }
          </div>
          {/* <button onClick={this.validateWords.bind(this)} >VALIDATE WORDS</button> */}
        </div>
      </div>
    );
  }
}

export default App;

import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Boggle from './components/Boggle';
import axios from 'axios';

const defaultDimension = 5

class App extends Component {
  constructor() {
    super();

    const boggle = new Boggle(defaultDimension);

    this.state = {
      boggle,
      dimension: defaultDimension,
      input: '',
      words: [],
      oxfordValidations: [],
      cache: [],
      validating: false
    }

  }
  componentDidMount() {
    window.addEventListener('keydown', e => e.key === 'Enter' ? this.addWord.call(this, this.state.input) : null);
    axios.get('/api/cache').then(response => {
      const cache = response.data;
      this.setState({ cache });
    });
  }
  resetBoard(dimension = defaultDimension) {
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
      const newWord = {
        value: word,
        validations
      }
      update.words = [newWord, ...this.state.words];
    }
    this.setState({ ...update });
    this.updatePath();
  }
  validateWords() {
    let { words, oxfordValidations, cache, validating } = this.state;

    // PREVENT FREQUENT REQUESTS
    if (validating) return;

    words = words.filter(word => {
      let valid = word.validations.length;
      let tested = cache.some(validation => validation.value.toUpperCase() === word.value.toUpperCase());
      return valid && !tested;
    }).map(word => word.value);

    this.setState({ validating: true });

    axios.post('/api/validate', { words }).then(response => {
      console.log(response.data);
      cache = [...cache, ...response.data];
      oxfordValidations = cache;
      setTimeout(() => this.setState({ cache, oxfordValidations, validating: false }), 500);
    });
  }
  resetValidations() {
    this.setState({
      oxfordValidations: []
    })
  }
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
      if (!validations.length) {
        input = '';
        boggle.resetPath();
        return;
      }
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
    const { boggle, words, oxfordValidations, validating } = this.state;
    const { board, path, dimensions } = boggle;
    const { x: size } = dimensions;
    console.log(this.state);

    const mappedWords = words.map((word, i) => {
      let selected = word.validations.includes(path);
      let valid = word.validations.length > 0;
      let tested = false;
      let defined = false;
      let oxfordValidation = oxfordValidations.find(validation => validation.value.toUpperCase() === word.value.toUpperCase());
      if (oxfordValidation) {
        tested = true
        defined = oxfordValidation.defined;
      }
      return {
        ...word,
        selected,
        valid,
        tested,
        defined
      }
    });

    const untestedWords = [];
    const definedWords = [];
    const undefinedWords = [];
    const invalidWords = [];

    mappedWords.forEach(word => {
      if (!word.valid) return invalidWords.push(word);
      if (!word.tested) return untestedWords.push(word);
      if (!word.defined) return undefinedWords.push(word);
      if (word.defined) return definedWords.push(word);
    });

    const wordsToDisplay = [...untestedWords, ...definedWords, ...undefinedWords, ...invalidWords];

    return (
      <div className="App" >
        <div className="left" >
          <div className="buttons" >
            <button onClick={this.resetBoard.bind(this, defaultDimension)} >RESET BOARD</button>
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
                              <div className="circle" >
                                {
                                  index ?
                                    <div className="index" >{index}</div>
                                    :
                                    null
                                }
                                {letter.value}
                              </div>
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
          <div className="buttons" >
            <button onClick={this.updatePath.bind(this)} >RESET PATH</button>
            {/* <h3>
              {
                path.map(letter => letter.value.toUpperCase())
              }
            </h3> */}
            <button onClick={this.addWord.bind(this, path.map(letter => letter.value).join(''), true)} >ADD WORD</button>
          </div>
        </div>
        <div id="divider" />
        <div className="right">
          <div className="header" >
            {/* <h3>ADD WORDS HERE</h3> */}
            <input
              placeholder="Type a word here..."
              value={this.state.input.toUpperCase()}
              onChange={this.handleChange.bind(this, 'input')}
              onKeyDown={e => e.key === 'Enter' ? this.addWord.call(this, this.state.input) : null}
            />
            <button onClick={this.addWord.bind(this, this.state.input)} >ADD WORD</button>
          </div>
          <div className={`body ${validating ? 'validating' : ''}`} >
            {
              !words.length ?
                <button className="word" >Your words will show up here...</button>
                :
                null
            }
            {
              wordsToDisplay.map((word, i) => {
                let { selected, valid, tested, defined } = word;
                console.log(selected, valid, tested, defined);
                return (
                  <button
                    className={`word ${valid ? 'valid' : 'invalid'} ${selected ? 'selected' : ''} ${defined ? 'defined' : 'undefined'} ${tested ? '' : 'untested'}`}
                    onClick={this.updatePath.bind(this, word)}
                  >
                    {word.value.toUpperCase() + ' (' + word.validations.length + ')'}
                    {word.validations.indexOf(path) + 1 ? ' - (' + (word.validations.indexOf(path) + 1) + ')' : ''}
                  </button>
                )
              })
            }
          </div>
          <div className="right-buttons" >
            <button onClick={this.validateWords.bind(this)} >VALIDATE WORDS</button>
            <button onClick={this.resetValidations.bind(this)} >RESET VALIDATIONS</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

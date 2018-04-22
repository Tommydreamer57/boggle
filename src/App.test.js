import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
// TEST
import Boggle from './boggle-creator';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Router><App /></Router>, div);
  ReactDOM.unmountComponentAtNode(div);
});

describe('boggle creation tests', () => {
  describe('dimension tests', () => {
    test('default board dimensions', () => {
      let boggle = new Boggle();
      let { board } = boggle;
      expect(board).toHaveLength(4);
      board.forEach(row => {
        expect(row).toHaveLength(4);
      });
    });
    test('create with one number argument', () => {
      let boggle = new Boggle(5);
      let { board } = boggle;
      expect(board).toHaveLength(5);
      board.forEach(row => {
        expect(row).toHaveLength(5);
      });
    });
    test('create with two number arguments', () => {
      let boggle = new Boggle(4, 5);
      let { board } = boggle;
      expect(board).toHaveLength(5);
      board.forEach(row => {
        expect(row).toHaveLength(4);
      });
    });
    test('create with object', () => {
      let boggle = new Boggle({ x: 3, y: 7 });
      let { board } = boggle;
      expect(board).toHaveLength(7);
      board.forEach(row => {
        expect(row).toHaveLength(3);
      });
    });
    test('create with array', () => {
      let boggle = new Boggle([
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
      ]);
      let { board } = boggle;
      expect(board).toHaveLength(4);
      board.forEach(row => {
        expect(row).toHaveLength(3);
      });
    });
  });
  describe('invalid dimension tests', () => {
    test('one invalid argument - negative value', () => {
      expect(() => new Boggle(-3)).toThrow(/positive/);
    });
    test('one valid and one invalid argument - negative value', () => {
      expect(() => new Boggle(5, -2)).toThrow(/positive/);
    });
    test('invalid object - negative value', () => {
      expect(() => new Boggle({ x: -2, y: 5 })).toThrow(/positive/);
    });
    test('invalid array - not 2D', () => {
      expect(() => new Boggle(['', ''])).toThrow(/two dimensional/);
    });
    test('invalid rows - inconsistent lengths', () => {
      expect(() => new Boggle([
        ['', ''],
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
      ])).toThrow(/length/);
    });
  });
  describe('letter tests', () => {
    test('instanceof Letter', () => {
      let boggle = new Boggle();
      let { board } = boggle;
      board.forEach(row => {
        row.forEach(letter => {
          expect(letter).toBeInstanceOf(Boggle.Letter);
        });
      });
    });
    test('correct properties', () => {
      let boggle = new Boggle(2);
      let { board } = boggle;
      board.forEach(row => {
        row.forEach(letter => {
          Boggle.validDirections.forEach(direction => {
            expect(letter).toHaveProperty(direction);
          });
        });
      });
    });
    test('create specific board', () => {
      let boggle = new Boggle([
        ['', '', 'a'],
        ['', 'b', ''],
        ['c', '', '']
      ]);
      let { board } = boggle;
      expect(board[0][2]).toHaveProperty('value', 'A');
      expect(board[1][1]).toHaveProperty('value', 'B');
      expect(board[2][0]).toHaveProperty('value', 'C');
    });
  });
  describe('board creator tests', () => {
    test('default dimension', () => {
      let board = Boggle.createBoard();
      expect(board).toHaveLength(4);
      board.forEach(row => {
        expect(row).toHaveLength(4);
      });
    });
    test('one number argument', () => {
      let board = Boggle.createBoard(3);
      expect(board).toHaveLength(3);
      board.forEach(row => {
        expect(row).toHaveLength(3);
      });
    });
    test('two number arguments', () => {
      let board = Boggle.createBoard(3, 7);
      expect(board).toHaveLength(7);
      board.forEach(row => {
        expect(row).toHaveLength(3);
      });
    });
    test('object argument', () => {
      let board = Boggle.createBoard({ x: 4, y: 8 });
      expect(board).toHaveLength(8);
      board.forEach(row => {
        expect(row).toHaveLength(4);
      });
    });
  });
  describe('invalid board creator tests', () => {
    test('one invalid argument - negative', () => {
      expect(() => Boggle.createBoard(-3)).toThrow(/positive/);
    });
    test('one valid and one invalid - negative', () => {
      expect(() => Boggle.createBoard(3, -4)).toThrow(/positive/);
    });
    test('invalid object - negative', () => {
      expect(() => Boggle.createBoard({ x: -2, y: 2 })).toThrow(/positive/);
    });
  });
});

describe('boggle use tests', () => {
  describe('validation tests', () => {
    const boggle = new Boggle([
      ['a', 'b', 'c'],
      ['c', 'a', 'b'],
      ['b', 'c', 'a']
    ]);
    const x = boggle.validate('x');
    const a = boggle.validate('a');
    const b = boggle.validate('b');
    const c = boggle.validate('c');
    const aa = boggle.validate('aa');
    const abc = boggle.validate('abc');
    const aba = boggle.validate('aba');
    const aBa = boggle.validate('aBa');
    test('returns array', () => {
      expect(boggle.validate()).toBeInstanceOf(Array);
    });
    test('returns correct length - one letter', () => {
      expect(x).toHaveLength(0);
      expect(a).toHaveLength(3);
      expect(b).toHaveLength(3);
      expect(c).toHaveLength(3);
    });
    test('returns correct length - multiple letters', () => {
      expect(aa).toHaveLength(4);
      expect(abc).toHaveLength(10);
      expect(aba).toHaveLength(4);
    });
    test('paths have correct length', () => {
      a.forEach(path => {
        expect(path).toHaveLength(1);
      });
      aa.forEach(path => {
        expect(path).toHaveLength(2);
      });
      aba.forEach(path => {
        expect(path).toHaveLength(3);
      });
    });
    test('case is ignored', () => {
      expect(aBa).toEqual(aba);
    });
  });
  describe('path creation tests', () => {
    const boggle = new Boggle(5);
    const { board } = boggle;
    test('no path on boggle object', () => {
      expect(boggle.path).toBeUndefined();
    });
    // test('initial path not on board', () => {
    //   boggle.board.forEach(row => {
    //     expect(row).not.toEqual(expect.arrayContaining(boggle.path));
    //   });
    // });
    test('starts at correct coordinates - two arguments', () => {
      let path = boggle.startPath(0, 0);
      expect(path).toHaveLength(1);
      expect(path[0]).toBe(board[0][0]);
    });
    test('starts at correct coordinates - object argument', () => {
      let path = boggle.startPath({ x: 0, y: 0 });
      expect(path).toHaveLength(1);
      expect(path[0]).toBe(board[0][0]);
    });
    test('can move throughout board', () => {
      let path = boggle.startPath(2, 3).move('up').move('right').move('upLeft');
      expect(path).toHaveLength(4);
      expect(path[0]).toBe(board[3][2]);
      expect(path[1]).toBe(board[2][2]);
      expect(path[2]).toBe(board[2][3]);
      expect(path[3]).toBe(board[1][2]);
    });
    test('can move multiple directions in one call', () => {
      let path = boggle.startPath(0, 0).move('down', 'right', 'downRight');
      expect(path).toHaveLength(4);
      expect(path[0]).toBe(board[0][0]);
      expect(path[1]).toBe(board[1][0]);
      expect(path[2]).toBe(board[1][1]);
      expect(path[3]).toBe(board[2][2]);
    });
    test('can move to specific coordinates', () => {
      let path = boggle.startPath(0, 0).move({ x: 1, y: 1 }, { x: 2, y: 2 });
      expect(path).toHaveLength(3);
      expect(path[0]).toBe(board[0][0]);
      expect(path[1]).toBe(board[1][1]);
      expect(path[2]).toBe(board[2][2]);
    });
    // test('move to path[0] resets path', () => {
    //   let path = boggle.startPath(0, 0).move('down', 'down', 'down', { x: 0, y: 0 });
    //   expect(path).toHaveLength(1);
    //   board.forEach(row => {
    //     expect(row).not.toEqual(expect.arrayContaining(path));
    //   });
    // });
    test('move to path[>0] chops off path at that point', () => {
      expect(boggle.startPath(0, 0).move('down', 'right', 'down', { x: 0, y: 1 })).toBe(boggle);
      expect(boggle.path).toHaveLength(1);
      expect(boggle.path[0]).toBe(boggle.board[0][0]);
    });
    // test('can reset path', () => {
    //   boggle.startPath(0, 0).move('down').move('right');
    //   boggle.resetPath();
    //   expect(boggle.path).toHaveLength(1);
    //   boggle.board.forEach(row => {
    //     expect(row).not.toEqual(expect.arrayContaining(boggle.path));
    //   });
    // });
    test('start returns new path object', () => {
      expect(boggle.startPath(0, 0)).toBeInstanceOf(Boggle.Path);
    });
    test('move returns path object', () => {
      let path = boggle.startPath(0, 0);
      expect(path.move('down')).toBe(path);
    });
    // test('reset returns path object', () => {
    //   expect(boggle.startPath(0, 0).move('downRight').resetPath()).toBe(boggle);
    // });
    test('can get current word from path', () => {
      let boggle = new Boggle([
        ['a', 'b', 'c'],
        ['d', 'e', 'f'],
        ['g', 'h', 'i']
      ]);
      expect(boggle.startPath(0, 0).move('down', 'down', 'right').currentWord).toEqual('ADGH');
      expect(boggle.startPath(2, 0).move('down', 'down', 'left').currentWord).toEqual('CFIH');
      expect(boggle.startPath(1, 1).move({ x: 2, y: 0 }, 'left', { x: 0, y: 0 }).currentWord).toEqual('ECBA');
    });
  });
  describe('invalid path creation tests', () => {
    const boggle = new Boggle(5);
    test('invalid starting point - negative value', () => {
      expect(() => boggle.startPath(0, -1)).toThrow(/invalid/);
    });
    test('invalid starting point - not on board', () => {
      expect(() => boggle.startPath(0, 5)).toThrow(/invalid/);
    });
    test('invalid starting point - object', () => {
      expect(() => boggle.startPath({ x: -1, y: 4 })).toThrow(/invalid/);
    });
    test('cannot move before starting path', () => {
      expect(() => boggle.resetPath().move()).toThrow(/before/);
    });
    test('invalid direction - misspelled', () => {
      expect(() => boggle.startPath(0, 0).move('downnn')).toThrow(/direction/);
      expect(() => boggle.startPath(0, 0).move('down').move('right').move('upright')).toThrow(/direction/);
    });
    test('invalid direction - outside of board', () => {
      expect(() => boggle.startPath(0, 0).move('up')).toThrow(/direction/);
      expect(() => boggle.startPath(0, 0).move('left')).toThrow(/direction/);
    });
    test('invalid direction - already used', () => {
      expect(() => boggle.startPath(0, 0).move('right').move('left')).toThrow(/already/);
      expect(() => boggle.startPath(0, 0).move('down').move('up')).toThrow(/already/);
    });
    test('invalid destination - missing coordinate', () => {
      expect(() => boggle.startPath(0, 0).move('down', { x: 0 })).toThrow(/both/);
      expect(() => boggle.startPath(2, 1).move('down', { y: 1 })).toThrow(/both/);
    });
    test('invalid destination - negative', () => {
      expect(() => boggle.startPath(0, 0).move('down', 'down', 'down', { x: -1, y: 0 })).toThrow(/invalid/);
    });
    test('invalid destination - not on board', () => {
      expect(() => boggle.startPath(0, 0).move({ x: 0, y: 5 })).toThrow(/invalid/);
    });
    test('invalid destination - not adjacent to path end', () => {
      expect(() => boggle.startPath(0, 0).move('down', 'down', { x: 2, y: 0 })).toThrow(/invalid/);
    })
  });
});

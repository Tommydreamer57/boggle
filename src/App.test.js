import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
// TEST
import Boggle, { boardCreator, Letter, validDirections } from './boggle-creator';

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
          expect(letter).toBeInstanceOf(Letter);
        });
      });
    });
    test('correct properties', () => {
      let boggle = new Boggle(2);
      let { board } = boggle;
      board.forEach(row => {
        row.forEach(letter => {
          validDirections.forEach(prop => {
            expect(letter).toHaveProperty(prop);
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
      let board = boardCreator();
      expect(board).toHaveLength(4);
      board.forEach(row => {
        expect(row).toHaveLength(4);
      });
    });
    test('one number argument', () => {
      let board = boardCreator(3);
      expect(board).toHaveLength(3);
      board.forEach(row => {
        expect(row).toHaveLength(3);
      });
    });
    test('two number arguments', () => {
      let board = boardCreator(3, 7);
      expect(board).toHaveLength(7);
      board.forEach(row => {
        expect(row).toHaveLength(3);
      });
    });
    test('object argument', () => {
      let board = boardCreator({ x: 4, y: 8 });
      expect(board).toHaveLength(8);
      board.forEach(row => {
        expect(row).toHaveLength(4);
      });
    });
  });
  describe('invalid board creator tests', () => {
    test('one invalid argument - negative', () => {
      expect(() => boardCreator(-3)).toThrow(/positive/);
    });
    test('one valid and one invalid - negative', () => {
      expect(() => boardCreator(3, -4)).toThrow(/positive/);
    });
    test('invalid object - negative', () => {
      expect(() => boardCreator({ x: -2, y: 2 })).toThrow(/positive/);
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
    test('initial path contains one letter', () => {
      expect(boggle.path).toHaveLength(1);
    });
    test('initial path not on board', () => {
      boggle.board.forEach(row => {
        expect(row).not.toEqual(expect.arrayContaining(boggle.path));
      });
    });
    test('starts at correct coordinates - two arguments', () => {
      boggle.start(0, 0);
      expect(boggle.path).toHaveLength(1);
      expect(boggle.path[0]).toBe(boggle.board[0][0]);
    });
    test('starts at correct coordinates - object argument', () => {
      boggle.start({ x: 0, y: 0 });
      expect(boggle.path).toHaveLength(1);
      expect(boggle.path[0]).toBe(boggle.board[0][0]);
    });
    test('can move throughout board', () => {
      boggle.start(2, 3).move('up').move('right').move('upLeft');
      expect(boggle.path).toHaveLength(4);
      expect(boggle.path[0]).toBe(boggle.board[3][2]);
      expect(boggle.path[1]).toBe(boggle.board[2][2]);
      expect(boggle.path[2]).toBe(boggle.board[2][3]);
      expect(boggle.path[3]).toBe(boggle.board[1][2]);
    });
    test('can move multiple directions in one call', () => {
      expect(boggle.start(0, 0).move('down', 'right', 'downRight')).toBe(boggle);
      expect(boggle.path).toHaveLength(4);
      expect(boggle.path[0]).toBe(boggle.board[0][0]);
      expect(boggle.path[1]).toBe(boggle.board[1][0]);
      expect(boggle.path[2]).toBe(boggle.board[1][1]);
      expect(boggle.path[3]).toBe(boggle.board[2][2]);
    });
    test('can move to specific coordinates', () => {
      expect(boggle.start(0, 0).move({ x: 1, y: 1 }, { x: 2, y: 2 })).toBe(boggle);
      expect(boggle.path).toHaveLength(3);
      expect(boggle.path[0]).toBe(boggle.board[0][0]);
      expect(boggle.path[1]).toBe(boggle.board[1][1]);
      expect(boggle.path[2]).toBe(boggle.board[2][2]);
    });
    test('move to path[0] resets path', () => {
      expect(boggle.start(0, 0).move('down', 'down', 'down', { x: 0, y: 0 })).toBe(boggle);
      expect(boggle.path).toHaveLength(1);
      boggle.board.forEach(row => {
        expect(row).not.toEqual(expect.arrayContaining(boggle.path));
      });
    });
    test('move to path[>0] chops off path at that point', () => {
      expect(boggle.start(0, 0).move('down', 'right', 'down', { x: 0, y: 1 })).toBe(boggle);
      expect(boggle.path).toHaveLength(1);
      expect(boggle.path[0]).toBe(boggle.board[0][0]);
    });
    test('can reset path', () => {
      boggle.start(0, 0).move('down').move('right');
      boggle.resetPath();
      expect(boggle.path).toHaveLength(1);
      boggle.board.forEach(row => {
        expect(row).not.toEqual(expect.arrayContaining(boggle.path));
      });
    });
    test('start returns boggle object', () => {
      expect(boggle.start(0, 0)).toBe(boggle);
    });
    test('move returns boggle object', () => {
      expect(boggle.start(0, 0).move('down')).toBe(boggle);
    });
    test('reset returns boggle object', () => {
      expect(boggle.start(0, 0).move('downRight').resetPath()).toBe(boggle);
    });
    test('can get current word from path', () => {
      let boggle = new Boggle([
        ['a', 'b', 'c'],
        ['d', 'e', 'f'],
        ['g', 'h', 'i']
      ]);
      expect(boggle.start(0, 0).move('down', 'down', 'right').currentWord).toEqual('ADGH');
      expect(boggle.start(2, 0).move('down', 'down', 'left').currentWord).toEqual('CFIH');
      expect(boggle.start(1, 1).move({ x: 2, y: 0 }, 'left', { x: 0, y: 0 }).currentWord).toEqual('ECBA');
    });
  });
  describe('invalid path creation tests', () => {
    const boggle = new Boggle(5);
    test('invalid starting point - negative value', () => {
      expect(() => boggle.start(0, -1)).toThrow(/invalid/);
    });
    test('invalid starting point - not on board', () => {
      expect(() => boggle.start(0, 5)).toThrow(/invalid/);
    });
    test('invalid starting point - object', () => {
      expect(() => boggle.start({ x: -1, y: 4 })).toThrow(/invalid/);
    });
    test('cannot move before starting path', () => {
      expect(() => boggle.resetPath().move()).toThrow(/before/);
    });
    test('invalid direction - misspelled', () => {
      expect(() => boggle.start(0, 0).move('downnn')).toThrow(/direction/);
      expect(() => boggle.start(0, 0).move('down').move('right').move('upright')).toThrow(/direction/);
    });
    test('invalid direction - outside of board', () => {
      expect(() => boggle.start(0, 0).move('up')).toThrow(/direction/);
      expect(() => boggle.start(0, 0).move('left')).toThrow(/direction/);
    });
    test('invalid direction - already used', () => {
      expect(() => boggle.start(0, 0).move('right').move('left')).toThrow(/already/);
      expect(() => boggle.start(0, 0).move('down').move('up')).toThrow(/already/);
    });
    test('invalid destination - missing coordinate', () => {
      expect(() => boggle.start(0, 0).move('down', { x: 0 })).toThrow(/both/);
      expect(() => boggle.start(2, 1).move('down', { y: 1 })).toThrow(/both/);
    });
    test('invalid destination - negative', () => {
      expect(() => boggle.start(0, 0).move('down', 'down', 'down', { x: -1, y: 0 })).toThrow(/invalid/);
    });
    test('invalid destination - not on board', () => {
      expect(() => boggle.start(0, 0).move({ x: 0, y: 5 })).toThrow(/invalid/);
    });
    test('invalid destination - not adjacent to path end', () => {
      expect(() => boggle.start(0, 0).move('down', 'down', { x: 2, y: 0 })).toThrow(/invalid/);
    })
  });
});

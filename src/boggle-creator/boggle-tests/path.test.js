import Boggle from '../Boggle';

describe('path creation tests', () => {
    const boggle = new Boggle(5);
    const { board } = boggle;
    test('no path on boggle object', () => {
        expect(boggle.path).toBeUndefined();
    });
    test('starts at correct coordinates - two arguments', () => {
        let path = boggle.startPath(3, 0);
        expect(path.path).toHaveLength(1);
        expect(path.path[0]).toBe(board[0][3]);
    });
    test('starts at correct coordinates - object argument', () => {
        let path = boggle.startPath({ x: 0, y: 0 });
        expect(path.path).toHaveLength(1);
        expect(path.path[0]).toBe(board[0][0]);
    });
    test('can move throughout board', () => {
        let path = boggle.startPath(2, 3).move('up').move('right').move('upLeft');
        expect(path.path).toHaveLength(4);
        expect(path.path[0]).toBe(board[3][2]);
        expect(path.path[1]).toBe(board[2][2]);
        expect(path.path[2]).toBe(board[2][3]);
        expect(path.path[3]).toBe(board[1][2]);
    });
    test('can move multiple directions in one call', () => {
        let path = boggle.startPath(0, 0).move('down', 'right', 'downRight');
        expect(path.path).toHaveLength(4);
        expect(path.path[0]).toBe(board[0][0]);
        expect(path.path[1]).toBe(board[1][0]);
        expect(path.path[2]).toBe(board[1][1]);
        expect(path.path[3]).toBe(board[2][2]);
    });
    test('can move to specific coordinates', () => {
        let path = boggle.startPath(0, 0).move({ x: 1, y: 1 }, { x: 2, y: 2 });
        expect(path.path).toHaveLength(3);
        expect(path.path[0]).toBe(board[0][0]);
        expect(path.path[1]).toBe(board[1][1]);
        expect(path.path[2]).toBe(board[2][2]);
    });
    test('can move through up / down / right / left methods', () => {
        let path = boggle.startPath(0, 0).down().downRight().left();
        expect(path.path).toHaveLength(4);
        expect(path.path[0]).toBe(board[0][0]);
        expect(path.path[1]).toBe(board[1][0]);
        expect(path.path[2]).toBe(board[2][1]);
        expect(path.path[3]).toBe(board[2][0]);
    });
    test('move to path.path[>0] chops off path at that point', () => {
        let path = boggle.startPath(0, 0).move('down', 'right', 'down', { x: 0, y: 1 });
        expect(path.path).toHaveLength(1);
        expect(path.path[0]).toBe(board[0][0]);
    });
    test('start returns new path object', () => {
        expect(boggle.startPath(0, 0)).toBeInstanceOf(Boggle.Path);
    });
    test('move returns path object', () => {
        let path = boggle.startPath(0, 0);
        expect(path.move('down')).toBe(path);
    });
    test('can access start of path', () => {
        let path = boggle.startPath(0, 0).down().down().downRight();
        expect(path.startOfPath).toBe(path.path[0]);
        expect(path.startOfPath).toBe(board[0][0]);
    });
    test('can access end of path', () => {
        let path = boggle.startPath(0, 0).right().right().downLeft();
        expect(path.endOfPath).toBe(path.path[path.path.length - 1]);
    })
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
    /*
    */
    // test('initial path not on board', () => {
    //   boggle.board.forEach(row => {
    //     expect(row).not.toEqual(expect.arrayContaining(boggle.path));
    //   });
    // });
    // test('move to path.path[0] resets path', () => {
    //   let path = boggle.startPath(0, 0).move('down', 'down', 'down', { x: 0, y: 0 });
    //   expect(path.path).toHaveLength(1);
    //   board.forEach(row => {
    //     expect(row).not.toEqual(expect.arrayContaining(path));
    //   });
    // });
    // test('can reset path', () => {
    //   boggle.startPath(0, 0).move('down').move('right');
    //   boggle.resetPath();
    //   expect(boggle.path.path).toHaveLength(1);
    //   boggle.board.forEach(row => {
    //     expect(row).not.toEqual(expect.arrayContaining(boggle.path));
    //   });
    // });
    // test('reset returns path object', () => {
    //   expect(boggle.startPath(0, 0).move('downRight').resetPath()).toBe(boggle);
    // });
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
    test('invalid direction - misspelled', () => {
        expect(() => boggle.startPath(0, 0).move('downnn')).toThrow(/direction/);
        expect(() => boggle.startPath(0, 0).move('down').move('right').move('upright')).toThrow(/direction/);
    });
    test('invalid direction - outside of board', () => {
        expect(() => boggle.startPath(0, 0).move('up')).toThrow(/direction/);
        expect(() => boggle.startPath(0, 0).move('left')).toThrow(/direction/);
    });
    test('invalid direction - start of path', () => {
        expect(() => boggle.startPath(0, 0).move('right').move('left')).toThrow(/beginning/);
        expect(() => boggle.startPath(0, 0).move('down').move('up')).toThrow(/beginning/);
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
        expect(() => boggle.startPath(0, 0).move('down', 'down', { x: 2, y: 3 })).toThrow(/invalid/);
    })
    /*
    */
    // test('cannot move before starting path', () => {
    //     expect(() => boggle.resetPath().move()).toThrow(/before/);
    // });
    // test('invalid direction - already used', () => {
    //     expect(() => boggle.startPath(0, 0).move('down', 'down', 'right', 'upLeft')).toThrow(/already/);
    // });
});
import Boggle from '../Boggle';

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

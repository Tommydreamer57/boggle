import Boggle from '../Boggle';

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

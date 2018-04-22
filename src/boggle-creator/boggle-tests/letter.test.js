import Boggle from '../Boggle';

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

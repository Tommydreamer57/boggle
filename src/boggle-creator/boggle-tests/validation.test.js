import Boggle from '../Boggle';

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

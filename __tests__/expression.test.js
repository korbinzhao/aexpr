const interpret = require('../src/index');

describe('unit test', () => {

    it('string', () => {
        expect(interpret('"abc"')).toBe('abc');
        expect(interpret('" abc"')).toBe(' abc');
        expect(interpret('"...abc"')).toBe('...abc');
        expect(interpret('" ...abc  "')).toBe(' ...abc  ');
    });

    it('boolean', () => {
        expect(interpret('true')).toBe(true);
        expect(interpret('false')).toBe(false);
    });

    it('object', () => {
        expect(typeof interpret('{"name": "jack", "age": 19, "address": "hometown street, great city", "info": {"other": true}}')).toBe('object');
    });

    it('calculator', () => {
        expect(interpret('0')).toBe(0);
        expect(interpret('1')).toBe(1);
        expect(interpret('1.23')).toBe(1.23);
        expect(interpret('1 + 2')).toBe(1 + 2);
        expect(interpret('1 - 2')).toBe(1 - 2);
        expect(interpret('3 * 2')).toBe(3 * 2);
        expect(interpret('3 / 2')).toBe(3 / 2);
        expect(interpret('1 / 0')).toBe(1 / 0);
        expect(interpret('1 + 2 / 4 * 6')).toBe(1 + 2 / 4 * 6);
        expect(interpret('1 + 2 / (4 * 6)')).toBe(1 + 2 / (4 * 6));
    });

    it('compare', () => {
        expect(interpret('1 > 2')).toBe(1 > 2);
        expect(interpret('1 < 2')).toBe(1 < 2);
        expect(interpret('1 <= 2')).toBe(1 <= 2);
        expect(interpret('2 <= 2')).toBe(2 <= 2);
        expect(interpret('2 === 2')).toBe(2 <= 2);
    });

    it('logical', () => {
        expect(interpret('1 && 0')).toBe(1 && 0);
        expect(interpret('1 && 2')).toBe(1 && 2);
        expect(interpret('1 || 0')).toBe(1 || 0);
        expect(interpret('1 || 2')).toBe(1 || 2);
    });

    it('ternary', () => {
        expect(interpret('2 > 1 ? 2 : 1')).toBe(2 > 1 ? 2 : 1);
        expect(interpret('1 ? 2 : 1')).toBe(1 ? 2 : 1);
        expect(interpret('1 > 2 ? "a" : "c"')).toBe(1 > 2 ? "a" : "c");
    });

    it('context', () => {
        expect(interpret('a + b', { a: 2, b: 3 })).toBe(2 + 3);
        expect(interpret('a + b / c.d', { a: 2, b: 3, c: { d: 5 } })).toBe(2 + 3 / 5);
        expect(interpret('a + b / c.d.e', { a: 2, b: 3, c: { d: { e: 5 } } })).toBe(2 + 3 / 5);
    });

    const arr = [
        { 'user': 'barney', 'active': false },
        { 'user': 'fred', 'active': false },
        { 'user': 'pebbles', 'active': true }
    ];

    it('function', () => {
        expect(interpret('_.indexOf(arr, 1)', { arr: [1, 2, 3, 4] })).toBe(0);
        expect(interpret(`_.findIndex(arr, { 'user': 'fred' })`, {
            arr
        })).toBe(1);
        expect(interpret(`_.findIndex(arr, opt)`, {
            arr,
            opt: { 'user': 'fred' }
        })).toBe(1);
        expect(interpret(`_.findIndex(arr, [ 'active', true ])`, {
            arr
        })).toBe(2);
        expect(interpret(`_.findIndex(arr, opt)`, {
            arr,
            opt: ['active', true]
        })).toBe(2);

        expect(interpret(`_.has(obj, 'a.b')`, { obj: { a: { b: 1, c: 2 } } })).toBe(true);

        expect(typeof interpret(`_.now()`)).toEqual('number');

        // prototype access and error throw
        expect(interpret.bind(null, `_.constructor()`)).toThrow('Illegal access, _.constructor is prohibited.');
        expect(interpret.bind(null, `_.__proto__.constructor`, {})).toThrow('Cannot read property \'__proto__\' of undefined');

        // variable declarations and error throw
        expect(interpret.bind(null, `var a = 1`)).toThrow('Parse error on line 1');
        expect(interpret.bind(null, `a = 1`)).toThrow('Lexical error on line 1. Unrecognized text');

        // avoid memory leak
        expect(interpret.bind(null, `while(true){console.log('loop')}`)).toThrow('Parse error');
    });
});
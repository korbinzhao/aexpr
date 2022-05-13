# expression.js

# usage
```
const interpret = require('expression.js');

// calculate
expect(interpret('1 + 2 / 4 * 6')).toBe(1 + 2 / 4 * 6);
expect(interpret('1 + 2 / (4 * 6)')).toBe(1 + 2 / (4 * 6));
// compare
expect(interpret('1 > 2')).toBe(1 > 2);
expect(interpret('1 < 2')).toBe(1 < 2);
expect(interpret('1 <= 2')).toBe(1 <= 2);
expect(interpret('2 <= 2')).toBe(2 <= 2);
expect(interpret('2 === 2')).toBe(2 <= 2);
// and or
expect(interpret('1 && 2')).toBe(1 && 2);
expect(interpret('1 || 0')).toBe(1 || 0);

// context accessing
expect(interpret('a + b / c.d.e', { a: 2, b: 3, c: { d: { e: 5 } } })).toBe(2 + 3 / 5);

// lodash functions
expect(interpret(`_.has(obj, 'a.b')`, { obj: { a: { b: 1, c: 2 } } })).toBe(true);
expect(interpret('_.indexOf(arr, 1)', { arr: [1, 2, 3, 4] })).toBe(0);

```


# support
* data type: number/boolean/string/object/array
* operators: + - * / && || tenary > >= < <=  === !== 
* context access: context access / property access
* custom functions: lodash functions, but prohibit function params, avoid prototype access

# advantage
* sandbox isolation
* data type support
* context access support
* operators support
* lodash functions support
* avoid memory leak by prohibit while etc.

# license
MIT

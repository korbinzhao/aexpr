# expression.js

expression.js is safe javascript expression interpreter, support operators / context accessing / property accessing / lodash functions.

# Support
* Data type: number/boolean/string/object/array
* Operators: 
    * Mathematical operators: + - * / 
    * Logic operators: && || > >= < <= === !== 
    * Tenary operator: a ? b : c
* Context access
* Property access
* Functions: 
    * Support all [Lodash](https://lodash.com/docs/4.17.15) functions, but prohibit function type input params to avoid prototype access

# Advantage
* Security assurance
    * Sandbox isolation to avoid prototype accessing using AST
    * Avoid memory leak by prohibit statements like 'while'
* [Lodash](https://lodash.com/docs/4.17.15) functions support

# Usage
```
const interpret = require('expression.js');

// invoke the function
// interpret(codeStr: string, context?: object);

// calculate
interpret('1 + 2 / 4 * 6');
interpret('1 + 2 / (4 * 6)');

// compare
interpret('1 > 2');
interpret('1 < 2');
interpret('1 <= 2');
interpret('2 <= 2');
interpret('2 === 2');

// logic
interpret('1 && 2');
interpret('1 || 0');

// context accessing && property accessing
interpret('a + b / c.d.e', { a: 2, b: 3, c: { d: { e: 5 } } });

// lodash functions
interpret(`_.has(obj, 'a.b')`, { obj: { a: { b: 1, c: 2 } } });
interpret('_.indexOf(arr, 1)', { arr: [1, 2, 3, 4] });

const arr = [
    { 'user': 'barney', 'active': false },
    { 'user': 'fred', 'active': false },
    { 'user': 'pebbles', 'active': true }
];

// not support function type input params to avoid prototype access
expect(interpret.bind(null, `_.findIndex(users, function(o) { return o.user == 'barney'; })`)).toThrow('Parse error');
// support ordinary input params
expect(interpret(`_.findIndex(users, { 'user': 'fred', 'active': false })`, {users: arr})).toBe(1);

```

# license
MIT

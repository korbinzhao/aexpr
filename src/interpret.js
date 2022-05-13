const parser = require('./parser');
const lodash = require('lodash');

// avoid prototype access
const FUNCTION_BLACKLIST = ['__proto__', 'prototype', 'constructor', 'hasOwnProperty', 'isPrototypeOf'];

function interpret(codeStr, context) {

    // generate ast
    const ast = parser.parse(codeStr);

    /** interpret ast */
    function exec(_ast) {

        if (typeof _ast !== 'object' || !_ast.__isAstNode) {
            return _ast;
        }

        switch (_ast.type) {
            case 'id':
                return context[_ast.id];
            case 'access':
                return exec(_ast.left)[exec(_ast.right)];
            case 'function':
                const func = _ast.left.substring(2);

                if (FUNCTION_BLACKLIST.includes(func)) {
                    throw new Error(`Illegal access, ${_ast.left} is prohibited.`);
                }

                return _ast.right ? lodash[func](..._ast.right.map(item => exec(item))) : lodash[func]();
            case 'operator':
                switch (_ast.opt) {
                    case '+':
                        return exec(_ast.left) + exec(_ast.right);
                    case '-':
                        return exec(_ast.left) - exec(_ast.right);
                    case '*':
                        return exec(_ast.left) * exec(_ast.right);
                    case '/':
                        return exec(_ast.left) / exec(_ast.right);
                    case '>':
                        return exec(_ast.left) > exec(_ast.right);
                    case '<':
                        return exec(_ast.left) < exec(_ast.right);
                    case '===':
                        return exec(_ast.left) === exec(_ast.right);
                    case '!==':
                        return exec(_ast.left) !== exec(_ast.right);
                    case '>=':
                        return exec(_ast.left) >= exec(_ast.right);
                    case '<=':
                        return exec(_ast.left) <= exec(_ast.right);
                    case '&&':
                        return exec(_ast.left) && exec(_ast.right);
                    case '||':
                        return exec(_ast.left) || exec(_ast.right);
                    case 'ternary':
                        return exec(_ast.left) ? exec(_ast.middle) : exec(_ast.right);
                }

        }

        return _ast;

    }

    return exec(ast);

}

module.exports = interpret;

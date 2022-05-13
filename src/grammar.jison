%lex

%%
\s+               { /* skip */ }
\d+(?:\.\d+)?     { return 'NUMBER'; }
_\.[a-zA-Z0-9]+   { return 'FUNCTION'; } /** only can invoke lodash function **/
\"[^"]*\"|\'[^"]*\'         { return 'STRING'; }
\{.*\}|\[.*\]     { return 'OBJECT' }
'+'               { return '+'; }
'-'               { return '-'; }
'*'               { return '*'; }
'/'               { return '/'; }
'('               { return '('; }
')'               { return ')'; }
'['               { return '['; }
']'               { return ']'; }
'{'               { return '{'; }
'}'               { return '}'; }
'.'               { return '.'; }
'"'               { return '"'; }
'true'            { return 'BOOLEAN'; }
'false'           { return 'BOOLEAN'; }
[_a-zA-Z$][\w\$]* { return 'ID'; }
'>='              { return '>='; }
'<='              { return '<='; }
'>'               { return '>'; }
'<'               { return '<'; }
'==='             { return '==='; }
'!=='             { return '!=='; }
'&&'              { return '&&'; }
'||'              { return '||'; }
'?'               { return '?'; }
':'               { return ':'; }
','               { return ','; }
%%

/lex

%left '?' ':'
%left '||'
%left '&&'
%left '>=' '<=' '>' '<' '===' '!=='
%left '+' '-'
%left '*' '/'
%left '"' '"'
%left '{' '}'

%start main

%%
  main
      : e
        { return $1 }
  ;
  e /** expression **/
      : NUMBER
        { $$ = Number(yytext) }
      | BOOLEAN
        { $$ = yytext === 'true' }
      | FUNCTION
        { $$ = yytext }
      | STRING
        { $$ = yytext.substring(1, yytext.length - 1) }
      | OBJECT
        { $$ = JSON.parse(yytext.replaceAll('\'', '"')) }
      | '-' e
        { $$ = { __isAstNode: true, type: 'operator', opt: '-', left: 0, right: $2 } }
      | e '-' e
        { $$ = { __isAstNode: true, type: 'operator', opt: '-', left: $1, right: $3 } }
      | e '+' e
        { $$ = { __isAstNode: true, type: 'operator', opt: '+', left: $1, right: $3 } }
      | e '*' e
        { $$ = { __isAstNode: true, type: 'operator', opt: '*', left: $1, right: $3 } }
      | e '/' e
        { $$ = { __isAstNode: true, type: 'operator', opt: '/', left: $1, right: $3 } }
      | e '>=' e
        { $$ = { __isAstNode: true, type: 'operator',  opt: '>=', left: $1, right: $3 } }
      | e '<=' e
        { $$ = { __isAstNode: true, type: 'operator', opt: '<=', left: $1, right: $3 } }
      | e '>' e
        { $$ = { __isAstNode: true, type: 'operator', opt: '>', left: $1, right: $3 } }
      | e '<' e
        { $$ = { __isAstNode: true, type: 'operator', opt: '<', left: $1, right: $3 } }
      | e '===' e
        { $$ = { __isAstNode: true, type: 'operator', opt: '===', left: $1, right: $3 } }
      | e '!==' e
        { $$ = { __isAstNode: true, type: 'operator', opt: '!==', left: $1, right: $3 } }
      | e '&&' e
        { $$ = { __isAstNode: true, type: 'operator', opt: '&&', left: $1, right: $3 } }
      | e '||' e
        { $$ = { __isAstNode: true, type: 'operator', opt: '||', left: $1, right: $3 } }
      | '(' e ')'
        { $$ = $2 }
      | a
        { $$ = $1 }
      | t
        { $$ = $1 }
      | f
        { $$ = $1 }
  ;
  a /** access **/
      : ID
        { $$ = { __isAstNode: true, type: 'id', id: $1 } }
      | a '[' e ']'
        { $$ = { __isAstNode: true, type: 'access', left: $1, right: $3 } }
      | a '.' ID
        { $$ = { __isAstNode: true, type: 'access', left: $1, right: $3 } }
  ;
  t  /** ternary **/
      : e '?' e ':' e
        { $$ = { __isAstNode: true, type: 'operator', opt: 'ternary', left: $1, middle: $3, right: $5 } }
  ;
  f  /** function **/
      : FUNCTION '(' p ')'
        { $$ = { __isAstNode: true, type: 'function', left: $1, right: $3} }
      | FUNCTION '(' ')'
        { $$ = { __isAstNode: true, type: 'function', left: $1, right: undefined} }
  ;
  p  /** parameters **/
      : e 
        { $$ = [$1] }
      | p ',' e
        { $$ = [...$1, $3] }
  ;
%%

Lexer = require('../lexer');
Lexeme = require('../lexeme');

function main() {
  var lexer = new Lexer("test/test.ds");
  var lexeme = lexer.lex();
  
  while(!(lexeme.type == "EOF")) {
    console.log(lexeme.toString());
    lexeme = lexer.lex();
  }

  console.log(lexeme.toString());

  return 0;
}

main();
  

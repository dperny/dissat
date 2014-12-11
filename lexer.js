Reader = require("./reader");
Lexeme = require("./lexeme");
/**
 * Provides a lexer, which returns lexemes
 * @module lexer
 */

/**
 * A lexer object. Tokenizes and returns lexemes
 */

var singleChars = {
  "(" : "OPAREN",
  ")" : "CPAREN",
  "{" : "OBRAK",
  "}" : "CBRAK",
  ":" : "COLON",
  "," : "COMMA",
  "[" : "OSQBRAK",
  "]" : "CSQBRAK",
  ";" : "SEMI",
  "+" : "PLUS",
  "-" : "MINUS",
  "*" : "TIMES",
  "/" : "DIVIDE",
  "%" : "MOD",
  // these characters aren't real lexemes, but they are here for some
  // code logic later that relies on them
  " " : "SPACE",
  "\t" : "TAB",
  "\n" : "NEWLINE"
};

var keywords = {
  "function" : "FUNC",
  "if"       : "IF",
  "then"     : "THEN",
  "else"     : "ELSE",
  "while"    : "WHILE",
  "do"       : "DO",
  "end"      : "END",
  "call"     : "CALL"
};

function Lexer(filename) { 
  filename = filename
  reader = new Reader(filename);

  var lexString = function(ch) {
    var string = "";
    ch = reader.read();
    while(ch != "\"") {
      string = string + ch;
      ch = reader.read();
    }
    return new Lexeme("STRING", string);
  }

  var lexNum = function(ch) {
    var number = ch;
    ch = reader.read();
    while(!isNaN(ch)) {
      number = number + ch;
      ch = reader.read();
    }
    reader.pushBack();
    return new Lexeme("NUMBER", number);
  }

  var lexWord = function(ch) {
    var word = ch;
    ch = reader.read();
    while(!(ch in singleChars)) {
      word = word + ch;
      ch = reader.read();
    }

    reader.pushBack();
    if(word in keywords) {
      return new Lexeme(keywords[word]);
    } else {
      return new Lexeme("NAME", word);
    }
  }

  /**
   * Returns the line number that the lexer is currently on
   */
  this.line = function() {
    return reader.getLine();
  }

  /**
   * Returns the next lexeme in the file
   */
  this.lex = function() {
    reader.skipWhiteSpace();
    var ch = reader.read();

    // first case handles if we've hit the end of the file, to save on work
    if(ch == "") { 
      return new Lexeme("EOF");

    // next case handles all single character lexemes
    } else if(ch in singleChars) {
      return new Lexeme(singleChars[ch]);

    // next case handles LT and LTE
    } else if(ch == "<") {
      if(reader.read() == "=") {
        return new Lexeme("LESSTHANEQ");
      } else {
        reader.pushBack();
        return new Lexeme("LESSTHAN");
      }
    
    // next handles GT and GTE
    } else if(ch == ">") {
      if(reader.read() == "=") {
        return new Lexeme("GREATERTHANEQ");
      } else {
        reader.pushBack();
        return new Lexeme("GREATERTHAN");
      }

    // handles EQ and ASSIGN
    } else if(ch == "=") {
      if(reader.read() == "=") {
        return new Lexeme("EQ");
      } else {
        reader.pushBack();
        return new Lexeme("ASSIGN");
      }
    
    // then, handle any multichar lexemes
    } else {
      // strings
      if(ch == "\"") {
        return lexString(ch);
      // numbers
      } else if(!isNaN(ch)) {
        return lexNum(ch);
      // words
      } else {
        return lexWord(ch);
      }
    }
  }
}

module.exports = Lexer;

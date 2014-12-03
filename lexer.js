Reader = require("reader");
Lexeme = require("lexeme");
/**
 * Provides a lexer, which returns lexemes
 * @module lexer
 */

/**
 * A lexer object. Tokenizes and returns lexemes
 */

function Lexer(filename) { 
  this._filename = filename;
  this._reader = new Reader(filename);

  this.lex = function() {
  }
}

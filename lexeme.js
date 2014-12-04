/**
 * A module containing the Lexeme object, which represents a single lexeme
 * in the language
 * 
 * @module Lexeme
 */

function Lexeme(type, value) {
  this.type = type;
  this.value = value;

  this.toString = function() {
    if(this.value == undefined) {
      return this.type;
    } else {
      return this.type + " " + this.value
    }
  }
}

module.exports = Lexeme;

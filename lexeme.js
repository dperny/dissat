var uuid = 0;
/**
 * A module containing the Lexeme object, which represents a single lexeme
 * in the language
 * 
 * @module Lexeme
 */

function Lexeme(type, value) {
  this.type = type;
  this.value = value;

  this.uuid = uuid++;

  this.left = null;
  this.right = null;

  this.closure = null;

  this.toString = function() {
    if(this.value == undefined) {
      return this.type;
    } else {
      return this.type + " " + this.value
    }
  };

  this.toVis = function() {
    return "" + this.uuid + " [label=\"" + this.type + ":" + this.value + "\"]"
  }
}

module.exports = Lexeme;

fs = require('fs');

/**
 * Provides various classes and functions that wrap File I/O functions
 * @module reader
 */

/**
 * An object that handles file IO and provides a simulation of a pushback buffer
 *
 * @class Reader
 * @constructor
 * @param {String} filename of a text file to read
 */
function Reader(filename) {
  this.filename = filename;

  // raw string interpretation of the filename
  file = fs.readFileSync(filename) + "";
  // index that we're currently reading
  index = 0;
  line = 1;

  /**
   * Skips over whitespace in a function
   *
   * @method skipWhiteSpace
   * @return undefined
   */
  this.skipWhiteSpace = function() {
    ch = file.charAt(index)
    while(ch == " " || ch == "\t" || ch == "\n") {
      index++;
      if(ch == "\n") { line++; }
      ch = file.charAt(index);
    }
  };

  /**
   * Reads the next character from the file
   * @method read
   * @return {String} the next character in the file
   */
  this.read = function() {
    var ch = file.charAt(index);
    index++;
    if(ch == "\n") { line++; }
    return ch;
  };

  /**
   * Pushes the reader back one character so that the next call to "read"
   * returns the same character
   * @method pushBack
   */
  this.pushBack = function(ch) {
    index--;
  };

  /**
   * Returns which line of the file was last being read. Starts at 1.
   * @method getLine
   * @return {Number} the line number the reader was last on
   */
  this.getLine = function() {
    return line;
  };
}

module.exports = Reader;

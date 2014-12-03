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
  this._file = fs.readFileSync(filename) + "";
  // index that we're currently reading
  this._index = 0;
  this._line = 1;

  /**
   * Skips over whitespace in a function
   *
   * @method skipWhiteSpace
   * @return undefined
   */
  this.skipWhiteSpace = function() {
    ch = this._file.charAt(this._index)
    while(ch == " " || ch == "\t" || ch == "\n") {
      this._index++;
      if(ch == "\n") { this._line++; }
      ch = this._file.charAt(this._index);
    }
  };

  /**
   * Reads the next character from the file
   * @method read
   * @return {String} the next character in the file
   */
  this.read = function() {
    var ch = this._file.charAt(this._index);
    this._index++;
    if(ch == "\n") { this._line++; }
    return ch;
  };

  /**
   * Pushes the reader back one character so that the next call to "read"
   * returns the same character
   * @method pushBack
   */
  this.pushBack = function(ch) {
    this._index--;
  };

  /**
   * Returns which line of the file was last being read. Starts at 1.
   * @method getLine
   * @return {Number} the line number the reader was last on
   */
  this.getLine = function() {
    return this._line;
  };
}

module.exports = Reader;

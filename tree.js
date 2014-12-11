Lexeme = require('./lexeme');

function tree(value, left, right) {
  this.value = value;

  if(left != undefined) {
    this.left = left;
  } else {
    this.left = null;
  }

  if(right != undefined) {
    this.right = left;
  } else {
    this.right = null;
  }

}

module.exports = tree;

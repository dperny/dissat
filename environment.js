Lexeme = require('./lexeme');

function Environment(parentEnv) {

  env = {}

  if(parentEnv == undefined) {
    this.parentEnv = null;
  } else {
    this.parentEnv = parentEnv;
  }

  this.lookup = function(variable) {
    // variable is a name parse tree
    var value = this.env[variable.value];

    if(this.value instanceof Environment && this.variable.right != null) {
      value.lookup(variable.right)
    } else if(value == undefined) {
      value = this.parentEnv.lookup(variable);
      if(value == undefined) {
        value = null;
      }
    } 

    return value;
  }

  this.update = function(variable, value) {
    var v = env[variable.value]
    if(v instanceof Environment) {
      v.update(variable.right, value);
    }

    if(v == undefined && this.parentEnv.lookup(variable) != undefined) {
      this.parentEnv.update(variable, value);
    } else {
      env[variable] = value;
    }

    return this.lookup(variable);
  }
}

module.exports = Environment;

var Environment = require('./environment');
function evaluate(pt) {

  function evalProgram(pt, env) {
    return evalExpressionList();
  }

  function evalExpressionList(pt, env) {
    var returnVal;
    while(pt.right != null) {
      returnVal = evalExpression(pt.left, env);
    }
    return returnVal;
  }

  function evalExpression(pt, env) {
    // all these types should be interpreted literally
    // if there is work to be done on them, it is only in assignment
    if( pt.type == "NUMBER" || pt.type == "STRING" ){
      return pt;

    } else if(pt.type == "NAME") {
      return env.lookup(pt);
    }

    // assignments require special evaluation
    } else if(pt.type == "ASSIGN") {
      // we might be assigning to a different environment, so check if we're
      // assigning to a table first

      // handle function definitions, where we want the closure
      if(pt.right.type == "FUNC") {
        pt.right.closure = env;
        return env.update(pt.left, pt.right);
      // handle regular assignments, where we just have to evaluate the left expression
      } else {
        return env.update(pt.left, evalExpression(pt.right, env));
      }

    // function calls require special evaluation
    } else if(pt.type == "CALL") {
      return evalCall(pt, env);
    // so do if statements
    } else if(pt.type == "IF") {
      return evalIf(pt, env);
    } else if(pt.type == "WHILE") {
      return evalWhile(pt, env);
    }
  }

  function evalCall(pt, env) {
    var func = evalExpression(pt.left, env);
    var nEnv = new Environment(func.closure);
    evalArgList(func.left, pt.right, nEnv);
  }

  function evalArgList(names, expressions, env) {
    if(names != null) {
      env.update(names, expressions, env);
    } 
  }

  var env = new Environment(null);
  evalProgram(pt, env);
}

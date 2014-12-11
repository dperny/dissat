var Lexer = require('./lexer');
var Lexeme = require('./lexeme');

function parse(lexer) {

  var last = lexer.lex();

  function check(type) {
    return last.type == type;
  }

  function match(type) {
    if(last.type == type) {
      var t = last;
      last = lexer.lex();
      return t;
    } else {
      try {
        var line = lexer.line()
        throw("Expected " + type + " got " + last + " line " + line);
      } catch(e) {
        // this actually throws its own error because this error has no stack.
        // quite usefully though, it gives me a stack trace.
        // good enough!
        console.log(e.stack());
      }
    }
  }

  function program() {
    var pt = new Lexeme("GLUE","program");
    pt.left = expressionList();
    pt.right = match("EOF");
    return pt;
  }

  function expressionList() {
    var pt = new Lexeme("GLUE","expressionList");
    if(expressionPending()) {
      pt.left = expression();
      match("SEMI");
      pt.right = expressionList();
      return pt;
    } else {
      return null;
    }
  }


  //
  // Block
  //
  function block() {
    var pt = match("DO");
    pt.left = expressionList();
    pt.right = match("END");
    return pt;
  }

  //
  // Expression
  //
  function expression() {
    var pt;
    if(literalPending()) {
      var p = literal();
      if(operatorPending()) {
        pt = operator();
        pt.left = p;
        pt.right = expression();
      } else {
        pt = p;
      }
    } else if(variablePending()) {
      var v = variable();

      if(check("ASSIGN")) {
        pt = match("ASSIGN");
        pt.left = v;
        pt.right = expression();
      } else if(operatorPending()) {
        pt = operator();
        pt.left = v;
        pt.right = expression();
      } else {
        pt = v;
      }
    } else if(funcDefPending()) {
      pt = funcDef();
    } else if(tableDefPending()) {
      pt = tableDef();
    } else if(whilePending()) {
      pt = whileBlock();
    } else if(ifPending()) {
      pt = ifBlock();
    } else if(funcCallPending()) {
      var f = funcCall();
      if(operatorPending()) {
        pt = operator();
        pt.left = f;
        pt.right = expression();
      } else {
        pt = f;
      }
    }
    return pt;
  }

  function expressionPending() {
    return variablePending()
        || literalPending()
        || funcCallPending()
        || funcDefPending()
        || tableDefPending()
        || ifPending();
  }

  // 
  // PRIMARY
  //
  /*
  function primary() {
    var pt;
    if(literalPending()) {
      pt = literal();
    } else {
      pt = funcCall();
    }
    return pt;
  }

  function primaryPending() {
    return literalPending() || funcCallPending();
  }
  */

  //
  // VARIABLE
  //
  function variable() {
    var pt = match("NAME");
    if(tableIndexPending()) {
      pt.right = tableIndex();
    }
    return pt;
  }

  function variablePending() {
    return check("NAME");
  }

  //
  // Literal
  //
  function literal() {
    if(check("NUMBER")) {
      return match("NUMBER");
    } else {
      return match("STRING");
    }
  }

  function literalPending() {
    return check("NUMBER") || check("STRING");
  }

  //
  // operator
  //
  function operator() {
    if(check("PLUS")) {
      return match("PLUS");
    } else if(check("MINUS")) {
      return match("MINUS");
    } else if(check("TIMES")) {
      return match("TIMES");
    } else if(check("DIVIDE")) {
      return match("DIVIDE");
    } else if(check("MODULUS")) {
      return match("MODULUS");
    } else if(check("LESSTHAN")) {
      return match("LESSTHAN");
    } else if(check("GREATERTHAN")) {
      return match("GREATERTHAN");
    } else if(check("LESSTHANEQ")) {
      return match("LESSTHANEQ");
    } else if(check("GREATERTHANEQ")) {
      return match("GREATERTHANEQ");
    } else {
      return match("EEQ");
    }
  }

  function operatorPending() {
    return check("PLUS")
        || check("MINUS")
        || check("TIMES")
        || check("DIVIDE")
        || check("MODULUS")
        || check("LESSTHAN")
        || check("GREATERTHAN")
        || check("LESSTHANEQ")
        || check("GREATERTHANEQ")
        || check("EEQ");
  }

  //
  // tableDef
  //
  function tableDef() {
    var pt = match("OBRAK");
    pt.left = fieldsList();
    pt.right = match("CBRAK");
    return pt;
  }

  function tableDefPending() {
    return check("OBRAK");
  }

  //
  // fieldsList
  //
  function fieldsList() {
    var pt = new Lexeme("GLUE","fieldsList");
    if(expressionPending()) {
      var e = expression();
      pt.left = match("COLON");
      pt.left.left = e;
      pt.left.right = expression();
      if(check("COMMA")) {
        match("COMMA");
        pt.right = fieldsList();
      }
    }
    return pt;
  }

  // don't think we ever use this so I'm just gonna skip it
  function fieldsListPending() { throw "baby" }

  //
  // tableIndex
  //
  function tableIndex() {
    var pt = new Lexeme("GLUE","fieldsList");
    match("OSQBRAK");
    pt.left = expression();
    match("CSQBRAK");
    if(tableIndexPending()) {
      pt.right = tableIndex();
    }
    return pt;
  }

  function tableIndexPending() {
    return check("OSQBRAK");
  }

  //
  // funcDef
  // 
  function funcDef() {
    var pt = match("FUNC");
    match("OPAREN");
    pt.left = paramList();
    match("CPAREN");
    pt.right = block();
    return pt;
  }

  function funcDefPending() {
    return check("FUNC");
  }

  function paramList() {
    if(check("NAME")) {
      var pt = match("NAME");
      if(check("COMMA")) {
        match("COMMA");
        pt.right = paramList();
      }
      return pt;
    } else {
      return null;
    }
  }

  // PROBABLY don't need this
  function paramListPending() {
    return check("NAME");
  }

  function funcCall() {
    var pt = match("CALL")
    pt.left = variable();
    match("OPAREN")
    pt.right = argList();
    match("CPAREN");
    return pt;
  }

  function funcCallPending() {
    return check("CALL");
  }

  function argList() {
    var pt = new Lexeme("GLUE","argList");
    if(expressionPending()) {
      pt.left = expression();
      if(check("COMMA")) {
        match("COMMA");
        pt.right = argList();
      }
      return pt;
    } else {
      return null;
    }
  }

  function ifBlock() {
    var pt = match("IF");
    pt.left = expression();
    pt.right = match("THEN");
    pt.right.left = expressionList();
    if(elsePending()) {
      pt.right.right = elseBlock();
    } else {
      pt.right.right = match("END");
    }
    return pt;
  }

  function ifPending() {
    return check("IF");
  }

  function elseBlock() {
    var pt = match("ELSE");

    if(ifPending()) {
      pt.right = ifBlock();
    } else {
      pt.right = expressionList();
      match("END")
    }

    return pt;
  }

  function elsePending() {
    return check("ELSE");
  }

  function whileBlock() {
    var pt = match("WHILE");
    pt.left = expression();
    pt.right = block();
  }

  function whilePending() {
    return check("WHILE");
  }

  return program();
}

// console.log(parse(new Lexer("test/test.ds")).left);
module.exports = parse;

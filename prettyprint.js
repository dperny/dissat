parse = require('./parser');
Lexer = require('./lexer');

// recursive descent prettyprinter? 
function prettyPrint(pt) {

  var operators = {
    "PLUS" : "+",
    "MINUS" : "-",
    "TIMES" : "*",
    "DIVIDE" : "/",
    "MODULUS" : "%",
    "LESSTHAN" : "<",
    "GREATERTHAN" : ">",
    "LESSTHANEQ" : "<=",
    "GREATERTHANEQ" : ">=",
    "EEQ" : "==",
    "ASSIGN" : "="
  };

  function indent(level) {
    var outstring = ""
    while(level > 0) {
      outstring = outstring + "  ";
      level--;
    }
    return outstring;
  }

  function ppProgram(pt, level) {
    return ppExpressionList(pt.left, level);
  }
  
  function ppExpressionList(pt, level) {
    var outstring = "";

    while(pt != null) {
      outstring = outstring + indent(level) + ppExpression(pt.left, level) + ";\n";
      pt = pt.right;
    }

    return outstring;
  }

  function ppBlock(pt, level) {
    var outstring = ""; 
    outstring = outstring + "do\n";
    outstring = outstring + ppExpressionList(pt.left, level + 1);
    outstring = outstring + indent(level) + "end";
    return outstring;
  }

  function ppExpression(pt, level) {
    var outstring = "";
    if(operators[pt.type] != undefined) {
      outstring = outstring 
        + ppExpression(pt.left) + " " 
        + operators[pt.type] + " "
        + ppExpression(pt.right, level);
    } else if(pt.type == "NAME") {
      outstring = outstring + ppVariable(pt, level);
    } else if(pt.type == "CALL") {
      outstring = outstring + ppFuncCall(pt, level);
    } else if(pt.type == "FUNC") {
      outstring = outstring + ppFunction(pt, level);
    } else if(pt.type == "OBRAK") {
      outstring = outstring + ppTableDef(pt, level);
    } else if(pt.type == "STRING") {
      outstring = outstring + "\"" + pt.value + "\"";
    } else if(pt.type == "IF") {
      outstring = outstring + ppIf(pt, level);
    } else if(pt.type == "WHILE") {
      outstring = outstring + ppWhile(pt,level);
    } else {
      outstring = outstring + pt.value;
    }

    return outstring;
  }

  function ppVariable(pt, level) {
    var outstring = "";
    outstring = outstring + pt.value;

    if(pt.right != null) {
      outstring = outstring + ppTableIndex(pt.right, level);
    }

    return outstring;
  }

  function ppTableIndex(pt, level) {
    var outstring = "";
    outstring = outstring + "[" + ppExpression(pt.left, level) + "]";
    if(pt.right != null) {
      outstring = outstring + ppTableIndex(pt.right, level); 
    }

    return outstring;
  }

  function ppFunction(pt, level) {
    var outstring = "";
    outstring = outstring + "function(";

    if(pt.left != null) { 
      outstring = outstring + ppParamList(pt.left, level);
    }

    outstring = outstring + ") ";
    outstring = outstring + ppBlock(pt.right, level);
    return outstring;
  }

  function ppParamList(pt, level) {
    var outstring = "";
    outstring = outstring + pt.value;

    if(pt.right != null) {
      outstring = outstring + ", " + ppParamList(pt.right, level);
    }

    return outstring;
  }


  function ppTableDef(pt, level) {
    var outstring = "{ ";
    outstring = outstring + ppFieldsList(pt.left, level);
    outstring = outstring + "}";
    return outstring;
  }

  function ppFieldsList(pt, level) {
    var outstring = "";

    outstring = outstring + ppExpression(pt.left.left, level);
    outstring = outstring + " : ";
    outstring = outstring + ppExpression(pt.left.right, level);

    if(pt.right != null) {
      outstring = outstring + ", " + ppFieldsList(pt.right, level);
    }

    return outstring;
  }

  function ppFuncCall(pt, level) {
    var outstring = "call ";
    outstring = outstring + ppVariable(pt.left) + "(";

    if(pt.right != null) {
      outstring = outstring + ppArgList(pt.right);
    }

    outstring = outstring + ")"

    return outstring;
  }

  function ppArgList(pt, level) {
    var outstring = "";

    outstring = outstring + pt.left.value;

    if(pt.right != null) {
      outstring = outstring + ", " + ppArgList(pt.right, level);
    }
    
    return outstring;
  }

  function ppIf(pt, level) {
    var outstring = "";

    outstring = outstring + "if ";
    outstring = outstring + ppExpression(pt.left, level);
    outstring = outstring + " then\n";
    outstring = outstring + ppExpressionList(pt.right.left, level + 1);
    outstring = outstring + ppElse(pt.right.right, level);

    return outstring;
  }

  function ppElse(pt, level) {
    var outstring = indent(level) + "else ";
    if(pt.right.type == "IF") {
      outstring = outstring + ppIf(pt.right, level);
    } else {
      outstring = outstring + "\n" + ppExpressionList(pt.right, level + 1) + indent(level) + "end";
    }

    return outstring;
  }


  return ppProgram(pt, 0);

}


console.log(prettyPrint(parse(new Lexer(process.argv[2]))));

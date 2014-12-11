var parse = require('./parser');
var Lexer = require('./lexer');
var Lexeme = require('./lexeme');
var fs = require('fs');

function treeify(pt) {
  
  function gvHelper(pt) {
    tree = ""
    tree = tree + pt.toVis() + ";\n"
    if(pt.left != null) {
      tree = tree + pt.uuid + " -> " + pt.left.uuid + ";\n";
      tree = tree + gvHelper(pt.left);
    }

    if(pt.right != null) {
      tree = tree + pt.uuid + " -> " + pt.right.uuid + ";\n";
      tree = tree + gvHelper(pt.right);
    }

    return tree;
  }

  function write(data) {
    fs.writeFile("test.dot",data,function(err) {});
  }

  tree = "digraph G {\n";
  tree = tree + gvHelper(pt); 
  tree = tree + "}\n"; 

  write(tree);

  return tree;
}

pt = parse(new Lexer("test/test.ds"));

treeify(pt);

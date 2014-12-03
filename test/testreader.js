assert = function(assertion, message) { 
  if(!assertion) { 
    console.log("Failed! " + message); 
  } 
}
fs = require('fs');
var Reader = require('../reader');

var testFile = "test/testReader.txt";

var tests = {
  
  /* Tests the Reader class */
  Reader:function() {
    var subtests = {
      
      /* Tests the Reader constructor */
      testreader:function() {
        console.log("\ttesting constructor");
        var reader = new Reader(testFile);

        // reader should be a reader
        assert(reader != undefined);
        assert(reader instanceof Reader);

        // responds to methods
        assert(reader.read != undefined);
        assert(reader.skipWhiteSpace != undefined);
        assert(reader.pushBack != undefined);
        
        // just a metatest
        assert(reader.asdf == undefined);

      },

      /* Tests the #read method */
      read:function() {
        console.log("\ttesting #read");
        var reader = new Reader(testFile);
        var ch = reader.read();
        assert(ch == " ");
        ch = reader.read();
        assert(ch == "a");
      },

      /* Tests the #skipWhiteSpace method */
      skipWhiteSpace:function() {
        console.log("\ttesting #skipWhiteSpace");
        var reader = new Reader(testFile);
        reader.skipWhiteSpace();
        assert(reader.read() == "a");
        reader.skipWhiteSpace();
        reader.skipWhiteSpace();
        assert(reader.read() == "b");
        reader.skipWhiteSpace();
        assert(reader.read() == "c");
      },
      
      /* Tests the #pushBack method */
      pushBack:function() {
        console.log("\ttesting #pushBack");
        var reader = new Reader(testFile);
        assert(reader.read() == " ");
        reader.pushBack();
        assert(reader.read() == " ");
      },
      
      getLine:function() {
        console.log("\ttesting #getLine");
        var reader = new Reader(testFile);
        reader.skipWhiteSpace();
        reader.read();
        reader.skipWhiteSpace();
        reader.read();
        reader.skipWhiteSpace();
        assert(reader.getLine() == 3, reader.getLine());
      }
    }

    console.log("Testing Reader...");
    for(test in subtests) {
      subtests[test]();
    }
    console.log("Reader tested!");
  }
}

function main() {
  for(test in tests) {
    tests[test]();
  }
}

main();

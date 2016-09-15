var fs = require('fs');
var src = fs.readFileSync('./src.js').toString();

var lines = src.split('\n').slice(0, -1);
var singleQuote = String.fromCharCode(39);
var $programString = "[\n" + lines.map(function(line) {
  var cleanedLine = line.replace(/\n/g, "\\n").replace(/\\/g, "\\\\");
  return "  " + singleQuote + cleanedLine + singleQuote + ",\n";
}).join("") + "\n]";
lines[2] = lines[2].replace("\"$programString\"", $programString);

console.log(lines.join('\n'));

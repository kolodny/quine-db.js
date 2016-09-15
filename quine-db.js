#!/usr/bin/env node

var programString = [
  '#!/usr/bin/env node',
  '',
  'var programString = "$programString";',
  'var db = {};',
  '',
  'var singleQuote = String.fromCharCode(39);',
  'var $program = "[\\n" + programString.map(function(line) {',
  '  var cleanedLine = line.replace(/\\n/g, "\\\\n").replace(/\\\\/g, "\\\\\\\\");',
  '  return "  " + singleQuote + cleanedLine + singleQuote + ",\\n";',
  '}).join("") + "  " + singleQuote + singleQuote + "\\n]";',
  'programString[2] = programString[2].replace("\\"$programString\\"", $program);',
  '',
  'var command = process.argv[2];',
  'var key = process.argv[3];',
  'var value = process.argv[4];',
  'var map = {',
  '  set: "OK",',
  '  get: db[key],',
  '  keys: Object.keys(db).sort().join("\\n"),',
  '  "delete": "OK"',
  '}',
  'if (Object.keys(map).indexOf(command) === -1) {',
  '  console.error("USAGE: quinedb.js [get k | set k v | delete k | keys]");',
  '  process.exit(1);',
  '}',
  'var stderr = map[command];',
  'if (command === "set") {',
  '  db[key] = value;',
  '}',
  'if (command === "delete") {',
  '  delete db[key];',
  '}',
  'console.error(stderr);',
  'programString = programString.join("\\n");',
  'var $db = "var db = " + JSON.stringify(db, null, 2) + ";";',
  'programString = programString.replace(/^var db = [\\s\\S]*?;$/m, $db);',
  'console.log(programString);',

];
var db = {};

var singleQuote = String.fromCharCode(39);
var $program = "[\n" + programString.map(function(line) {
  var cleanedLine = line.replace(/\n/g, "\\n").replace(/\\/g, "\\\\");
  return "  " + singleQuote + cleanedLine + singleQuote + ",\n";
}).join("") + "  " + singleQuote + singleQuote + "\n]";
programString[2] = programString[2].replace("\"$programString\"", $program);

var command = process.argv[2];
var key = process.argv[3];
var value = process.argv[4];
var map = {
  set: "OK",
  get: db[key],
  keys: Object.keys(db).sort().join("\n"),
  "delete": "OK"
}
if (Object.keys(map).indexOf(command) === -1) {
  console.error("USAGE: quinedb.js [get k | set k v | delete k | keys]");
  process.exit(1);
}
var stderr = map[command];
if (command === "set") {
  db[key] = value;
}
if (command === "delete") {
  delete db[key];
}
console.error(stderr);
programString = programString.join("\n");
var $db = "var db = " + JSON.stringify(db, null, 2) + ";";
programString = programString.replace(/^var db = [\s\S]*?;$/m, $db);
console.log(programString);

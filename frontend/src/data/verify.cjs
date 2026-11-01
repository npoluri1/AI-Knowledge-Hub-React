var c = require('fs').readFileSync('D:/WorkSpace/Claude_Code/AI_Stuff_Data/AI_Knowledge_Hub_React/frontend/src/data/pythonMasterHubData.js', 'utf8');
var i = c.indexOf('id: "web-spring"');
var s = c.substring(i, c.indexOf('examples:', i));
var m = s.match(/"[^"]+"/g) || [];
var orig = m.filter(function(x) { return x.length > 25 && x.indexOf('color') === -1 && x.indexOf('id:') === -1; });

var combined = require('fs').readFileSync('D:/WorkSpace/Claude_Code/AI_Stuff_Data/AI_Knowledge_Hub_React/frontend/src/data/webSpringTopicsEnhanced.js', 'utf8');
var enh = combined.match(/"([^"]+)":\s*\{/g) || [];
var enhanced = enh.map(function(x) { return x.replace(/":\s*\{$/, '').replace(/^"/, ''); });

var missing = orig.filter(function(o) { return enhanced.indexOf(o) === -1; });
var extra = enhanced.filter(function(e) { return orig.indexOf(e) === -1; });

console.log('Original topics: ' + orig.length);
console.log('Enhanced topics: ' + enhanced.length);
console.log('Missing from enhanced: ' + missing.length);
missing.forEach(function(x) { console.log('  MISSING: ' + x); });
console.log('Extra in enhanced: ' + extra.length);
extra.forEach(function(x) { console.log('  EXTRA: ' + x); });

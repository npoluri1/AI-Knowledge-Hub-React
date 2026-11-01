// combiner.cjs - combines part1, part2, part3 into single self-contained file
const fs = require('fs');
const path = require('path');

const dir = 'D:/WorkSpace/Claude_Code/AI_Stuff_Data/AI_Knowledge_Hub_React/frontend/src/data';

const part1 = fs.readFileSync(path.join(dir, 'part1.js'), 'utf8');
const part2 = fs.readFileSync(path.join(dir, 'part2.js'), 'utf8');
const part3 = fs.readFileSync(path.join(dir, 'part3.js'), 'utf8');

// Extract the object content from each part (everything between the first { and last })
function extractObject(content) {
  const firstBrace = content.indexOf('{');
  const lastBrace = content.lastIndexOf('}');
  return content.substring(firstBrace + 1, lastBrace);
}

const obj1 = extractObject(part1);
const obj2 = extractObject(part2);
const obj3 = extractObject(part3);

const combined = `// Auto-generated enhanced data for Web/Spring/Graphics topics
// Contains "why" explanations and real-world code examples for ALL topics
// DO NOT EDIT MANUALLY - regenerate from source data

export const WEB_SPRING_TOPICS_ENHANCED = {${obj1}${obj2}${obj3}};
`;

fs.writeFileSync(path.join(dir, 'webSpringTopicsEnhanced.js'), combined, 'utf8');
console.log('Combined file written successfully');

// Count topics
const whyCount = (combined.match(/why:/g) || []).length;
const codeCount = (combined.match(/code:/g) || []).length;
console.log('Topics with "why":', whyCount);
console.log('Topics with "code":', codeCount);
console.log('File size:', (Buffer.byteLength(combined) / 1024).toFixed(1), 'KB');

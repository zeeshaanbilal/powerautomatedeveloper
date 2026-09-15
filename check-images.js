const fs = require('fs');
const sizeOf = require('image-size');
const path = require('path');

const dir = 'C:\\Users\\Hassaan\\.gemini\\antigravity-ide\\brain\\c4ccde94-c0f3-4263-a412-74114abe4928\\.user_uploaded';
const files = fs.readdirSync(dir);

files.slice(-4).forEach(file => {
  const dimensions = sizeOf(path.join(dir, file));
  console.log(`${file}: ${dimensions.width}x${dimensions.height}`);
});

const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

function walkSync(dir, filelist = [], depth = 0) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isDirectory()) {
        if (file === 'node_modules' || file.startsWith('.git')) {
          continue; // Skip node_modules and Git-related directories
        }
        filelist.push({
          name: `${'| '.repeat(depth)}${file}/`,
          path: filePath
        });
        walkSync(filePath, filelist, depth + 1);
      } else {
        const mimeType = mime.lookup(filePath);
        if (mimeType && mimeType.startsWith('text/')) {
          // If the file contains plain text, add its contents to the output file
          const content = fs.readFileSync(filePath, 'utf8');
          const placeholderContent = `[ ${file} ]\n${content}\n---\n`;
          filelist.push({
            name: `${'| '.repeat(depth + 1)}${file}`,
            path: filePath,
            content: placeholderContent
          });
        } else if (file.match(/^\.env.*/)) {
          // If the file is an .env file, copy the variable names and replace the contents with [PLACEHOLDER]
          const content = fs.readFileSync(filePath, 'utf8');
          const variableNames = content.match(/^\w+/gm) || [];
          const placeholderContent = variableNames.map(name => `${name}=[PLACEHOLDER]`).join('\n');
          filelist.push({
            name: `${'| '.repeat(depth + 1)}${file}`,
            path: filePath,
            content: placeholderContent
          });
        } else {
          filelist.push({
            name: `${'| '.repeat(depth + 1)}${file}`,
            path: filePath
          });
        }
      }
    }
    return filelist;
  }
  

const files = walkSync('C:\\Users\\max72\\Documents\\GitHub\\AnmaSoftV3');
let text = '';
for (const file of files) {
  text += `${file.name}\n`;
  if (file.content) {
    text += `${file.content}\n`;
  } else if (file.path && fs.statSync(file.path).isFile()) { // Check if file.path is a file
    const contents = fs.readFileSync(file.path, 'utf8');
    text += `${contents}\n---\n`;
  }
}
fs.writeFile('file-list.txt', text, (err) => {
  if (err) throw err;
  console.log('The file list has been saved to file-list.txt');
});
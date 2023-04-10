const fs = require('fs');
const path = require('path');

function walkSync(dir, filelist = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      walkSync(filePath, filelist);
    } else {
      filelist.push({
        name: file,
        path: filePath
      });
    }
  }
  return filelist;
}

const files = walkSync('./');
const text = files.map(file => `${file.name} - ${file.path}`).join('\n');

fs.writeFile('file-list.txt', text, (err) => {
  if (err) throw err;
  console.log('The file list has been saved to file-list.txt');
});
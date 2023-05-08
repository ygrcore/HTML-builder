const { readdir } = require('node:fs/promises');
const fs = require('fs');
const path = require('path');

const pathFrom = path.join(__dirname, 'styles');
const pathTo = path.join(__dirname, 'project-dist', 'bundle.css');
// const pathFrom = path.join(__dirname, 'test-files', 'styles'); // path for test
// const pathTo = path.join(__dirname, 'test-files', 'bundle.css'); // path for test


async function mergeStyles(src, dest) {
  try {
    let data = '';
    let files = await readdir(src, {withFileTypes: true});
    files = files.filter(item => path.extname(item.name) === '.css');
    const output = fs.createWriteStream(dest)
    for (let file of files) {
      if (file.isFile()) {
        const input = fs.createReadStream(path.join(src, file.name), 'utf-8');
        input.on('data', chunk => data += chunk)
        input.on('end', () => console.log(file.name, 'end'))
        input.pipe(output);
      }
    }
  } catch (err) {
      console.error(err);
  }
}

mergeStyles(pathFrom, pathTo);
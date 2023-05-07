const fs = require('fs');
const path = require('path');

const folder = path.join(__dirname, 'secret-folder')

async function myReadDir (pathFolder) {
  const files = await fs.promises.readdir(pathFolder, {withFileTypes: true})
  for (let file of files) {
    if (file.isFile()) {
      let [fileName, fileExt] = file.name.split('.');
      let fileStat = await fs.promises.stat(path.join(folder, file.name));
      console.log(`${fileName} - ${fileExt} - ${fileStat.size}B`);
    }
  }
}

myReadDir(folder);
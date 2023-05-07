const fs = require('fs');
const path = require('path');

const from = path.join(__dirname, 'files');
const to = path.join(__dirname, 'files-copy');

async function copyDir(src,dest) {
  try {
    await fs.promises.mkdir(dest, { recursive: true });

    const prevFiles = await fs.promises.readdir(dest, {  withFileTypes: true});
    if (prevFiles) {
      for (const file of prevFiles) {
        await fs.promises.unlink(path.join(dest, file.name));
      }
    }

    const entries = await fs.promises.readdir(src, {withFileTypes: true});
    for(let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if(entry.isDirectory()) {
            await copyDir(srcPath, destPath);
        } else {
            await fs.promises.copyFile(srcPath, destPath);
        }
    }
  } catch (error) {
    console.log(error.message);
  }
}

copyDir(from, to);

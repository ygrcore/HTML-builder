const fs = require('fs');
const path = require('path');

const projectFolder = path.join(__dirname, 'project-dist');
const template = path.join(__dirname, 'template.html');
const assetsFrom = path.join(__dirname, 'assets');
const assetsTo = path.join(projectFolder, 'assets');
const stylesFrom = path.join(__dirname, 'styles');
const stylesTo = path.join(projectFolder, 'style.css');
const components = path.join(__dirname, 'components');

async function bundleProject(folder, html) {
  await fs.promises.mkdir(folder, { recursive: true })
  .then(() => {
    fs.readFile(html, 'utf-8', (err, data) => {
      if (err) throw err;
      fs.writeFile(path.join(folder, 'template.html'), data, (err) => {
        if (err) throw err;
        console.log('done');
      })
    })
  })
}

bundleProject(projectFolder, template)

async function creatHtmlFromComponents(comps, filename) {
  const htmlParts = {};
  const htmlComponents = (await fs.promises.readdir(comps, {  withFileTypes: true}))
    .filter(item => path.extname(item.name) === '.html');
  for (let part of htmlComponents) {
    if (part.isFile()) {
      htmlParts[`${part.name.slice(0, -5)}`] = await fs.promises.readFile(path.join(comps, part.name), 'utf8');
    }

  }

  try {
    let contents = await fs.promises.readFile(filename, 'utf-8');
    for (let key of Object.keys(htmlParts)) {
      contents = contents.replace('{{' + key + '}}', htmlParts[key]);
    }
    await fs.promises.writeFile(filename, contents);
    // console.log(contents)
  } catch (err) {
    console.log(err);
  }
  // console.log(htmlParts)
}
creatHtmlFromComponents(components, path.join(projectFolder, 'template.html'));

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

copyDir(assetsFrom, assetsTo);

async function mergeStyles(src, dest) {
  try {
    let data = '';
    let files = await fs.promises.readdir(src, {withFileTypes: true});
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

mergeStyles(stylesFrom, stylesTo);
const fs = require('fs');
const path = require('path');

(async () => {

  // create folder project-dist

  const projectDistPath = path.join(__dirname, 'project-dist');

  await fs.promises.rm(projectDistPath, { recursive: true, force: true });
  await fs.promises.mkdir(projectDistPath, { recursive: true });

  // write and append index.html

  const templatePath = path.join(__dirname, 'template.html');
  const componentsPath = path.join(__dirname, 'components');
  const projectIndexHTMLPath = path.join(projectDistPath, 'index.html');

  await fs.promises.writeFile(projectIndexHTMLPath, '', error => {
    if (error) throw error;
  });

  let templateData = await fs.promises.readFile(templatePath, (error, data) => {
    if (error) throw error;
    return data;
  })

  fs.readdir(componentsPath, { withFileTypes: true }, (error, files) => {
    if (error) throw error;

    const filesHTML = files.filter(file => {
      const filePath = path.join(componentsPath, file.name);
      const fileExt = path.parse(filePath).ext;
      return file.isFile() && fileExt === '.html';
    });

    let obj = {};

    filesHTML.forEach(file => {
      const filePath = path.join(componentsPath, file.name);
      const fileName = path.parse(filePath).name;

      fs.readFile(filePath, (error, data) => {
        if (error) throw error;

        obj[`${fileName}`] = data.toString();

        if (Object.keys(obj).length === filesHTML.length) {
          for (key in obj) {
            let regexp = new RegExp(`{{${key}}}`, 'g')
            templateData = templateData.toString().replace(regexp, obj[key]);
          }

          fs.appendFile(projectIndexHTMLPath, templateData, error => {
            if (error) throw error;
          });
        }
      })
    });

  })

  // bundle styles

  const stylesPath = path.join(__dirname, 'styles');
  const projectStylesPath = path.join(projectDistPath, 'style.css');

  await fs.promises.writeFile(projectStylesPath, '', error => {
    if (error) throw error;
  });

  fs.readdir(stylesPath, { withFileTypes: true }, (error, files) => {
    if (error) throw error;

    files.forEach(file => {
      const filePath = path.join(stylesPath, file.name);
      const fileExt = path.parse(filePath).ext;

      if (file.isFile() && fileExt === '.css') {
        fs.readFile(filePath, (error, data) => {
          if (error) throw error;
          fs.appendFile(projectStylesPath, `${data}\n`, (error) => {
            if (error) throw error;
          });
        })
      }
    })
  });

  // copy assets

  const assetsPath = path.join(__dirname, 'assets');
  const projectAssetsPath = path.join(projectDistPath, 'assets');

  await fs.promises.rm(projectAssetsPath, { recursive: true, force: true });
  await fs.promises.mkdir(projectAssetsPath, { recursive: true });

  function copyDirectory(src, dest) {

    fs.readdir(src, { withFileTypes: true }, (error, files) => {
      if (error)
        throw error;

      files.forEach(file => {
        const scrFilePath = path.join(src, file.name);
        const destFilePath = path.join(dest, file.name);

        if (file.isDirectory()) {
          fs.promises.mkdir(destFilePath);
          copyDirectory(scrFilePath, destFilePath);
        } else if (file.isFile()) {
          fs.copyFile(scrFilePath, destFilePath, error => {
            if (error)
              throw err;
          });
        }
      });
    });
  }

  copyDirectory(assetsPath, projectAssetsPath);
})();
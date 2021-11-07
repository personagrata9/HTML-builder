const fs = require('fs');
const path = require('path');

(async () => {
  const stylesPath = path.join(__dirname, 'styles');
  const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

  await fs.promises.writeFile(bundlePath, '', error => {
    if (error) throw error;
  }
  );

  fs.readdir(stylesPath, { withFileTypes: true }, (error, files) => {
    if (error) throw error;

    files.forEach(file => {
      if (file.isFile()) {
        const filePath = path.join(stylesPath, file.name);
        const fileExt = path.parse(filePath).ext;

        if (fileExt === '.css') {
          fs.readFile(filePath, (error, data) => {
            if (error) throw error;
            fs.appendFile(bundlePath, `${data}\n`, (error) => {
              if (error) throw error;
            });
          })
        }
      }
    })
  });
})();
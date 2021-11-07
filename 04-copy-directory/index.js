const fs = require('fs');
const path = require('path');

(async () => {
  const srcFolderPath = path.join(__dirname, 'files');
  const destFolderPath = path.join(__dirname, 'files-copy');

  await fs.promises.rm(destFolderPath, { recursive: true, force: true });
  await fs.promises.mkdir(destFolderPath, { recursive: true });

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

  copyDirectory(srcFolderPath, destFolderPath);
})();
const fs = require('fs');
const path = require('path');

(async () => {
  const destFolderPath = path.join(__dirname, 'files-copy');
  const srcFolderPath = path.join(__dirname, 'files');

  await fs.promises.rm(destFolderPath, { recursive: true, force: true });
  await fs.promises.mkdir(destFolderPath, { recursive: true });

  fs.readdir(srcFolderPath, (error, files) => {
    if (error)
      throw error;

    files.forEach(file => {
      const scrFilePath = path.join(srcFolderPath, file);
      const destFilePath = path.join(destFolderPath, file);

      fs.copyFile(scrFilePath, destFilePath, error => {
        if (error)
          throw err;
      });
    });
  });
})();
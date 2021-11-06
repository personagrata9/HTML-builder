const fs = require('fs');
const path = require('path');

const secretFolderPath = path.join(__dirname, 'secret-folder');

fs.readdir(secretFolderPath, { withFileTypes: true }, (error, files) => {
  if (error) throw error;
  else {
    files.forEach(file => {
      if (file.isFile()) {
        const filePath = path.join(__dirname, 'secret-folder', file.name);

        fs.stat(filePath, (error, stats) => {
          if (error) throw error;
          else {
            const fileName = path.parse(filePath).name;
            const fileExt = path.parse(filePath).ext.toString().slice(1);
            const fileSize = stats.size / 1000;
            console.log(`${fileName} - ${fileExt} - ${fileSize}kb`);
          }
        });

      } else {
        return;
      }
    })
  }
});
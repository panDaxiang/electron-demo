const fs = window.require('fs').promises

const fileHelper = {
  writeFile: (filePath, data) =>
    fs.writeFile(filePath, data, {
      encoding: 'utf8',
    }),
  deleteFile: filePath => fs.unlink(filePath),
  readFile: filePath =>
    fs.readFile(filePath, {
      encoding: 'utf8',
    }),
  rename: (oldPath, newPath) => fs.rename(oldPath, newPath),
  readdir: dirPath => fs.readdir(dirPath),
  watch: path => fs.watch(path),
}

export default fileHelper

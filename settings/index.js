const { remote } = require('electron')
const Store = require('electron-store')

const store = new Store({ name: 'Settings' })

const $ = id => document.querySelector(id)
let saveLocation = store.get('location')

document.addEventListener('DOMContentLoaded', function() {
  if (saveLocation) {
    $('#save_location').innerHTML = saveLocation
  }
  $('#open_directory').addEventListener('click', function() {
    remote.dialog
      .showOpenDialog({
        properties: ['openDirectory'],
        message: '选择文件保存目录',
      })
      .then(path => {
        if (path && path.filePaths && Array.isArray(path.filePaths)) {
          const [getPath] = path.filePaths
          if (getPath) {
            $('#save_location').innerHTML = getPath
            saveLocation = getPath
          }
        }
      })
  })
  $('#submit').addEventListener('click', function() {
    store.set('location', saveLocation)
    remote.getCurrentWindow().close()
  })
})

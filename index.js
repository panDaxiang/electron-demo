const { app, BrowserWindow, Menu } = require('electron')

const menuTemplate = require('./src/configs/menuTemplate')

app.once('ready', () => {
  const mainWindow = new BrowserWindow({
    width: 960,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  })

  mainWindow.loadURL('http://localhost:3000')

  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)

  require('devtron').install()
})

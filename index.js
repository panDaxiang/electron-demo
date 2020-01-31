const { app, BrowserWindow } = require('electron')

app.once('ready', () => {
  const mainWindow = new BrowserWindow({
    width: 960,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  })

  mainWindow.loadURL('http://localhost:3000')

  require('devtron').install()
})

const { BrowserWindow } = require('electron')

class AppWindow extends BrowserWindow {
  constructor(config, locationUrl) {
    const basicConfig = {
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
      },
      show: false,
      backgroundColor: '#fff',
    }

    super({ ...basicConfig, ...config })

    this.loadURL(locationUrl)

    this.once('ready-to-show', () => {
      this.show()
    })
  }
}

module.exports = AppWindow

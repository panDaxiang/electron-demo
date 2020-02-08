const { app, Menu, ipcMain } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");

const menuTemplate = require("./menuTemplate");
const AppWindow = require("./AppWindow");

app.once("ready", () => {
  let mainWindow = new AppWindow(
    {
      width: 1024,
      height: 720
    },
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "./dist/index.html")}`
  );

  mainWindow.on("close", () => {
    mainWindow = null;
  });

  ipcMain.on("open-setting-window", () => {
    let settingWindow = new AppWindow(
      {
        parent: mainWindow
      },
      `file://${path.join(__dirname, "./settings/index.html")}`
    );
    settingWindow.on("close", () => {
      settingWindow = null;
    });
  });

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  if (isDev) {
    require("devtron").install();
  }
});

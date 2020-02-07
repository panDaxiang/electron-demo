const { app } = require('electron')

const isMac = process.platform === 'darwin'

const menuTemplate = [
  // { role: 'appMenu' }
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            { label: '关于', role: 'about' },
            { type: 'separator' },
            { label: '设置', role: 'setting' },
            { type: 'separator' },
            { label: '服务', role: 'services' },
            { type: 'separator' },
            { label: '隐藏', role: 'hide' },
            { role: 'hideothers' },
            { type: 'separator' },
            { label: '退出', role: 'quit' },
          ],
        },
      ]
    : []),
  // { role: 'fileMenu' }
  {
    label: '文件',
    submenu: [
      {
        label: '新建',
        accelerator: 'CmdOrCtrl+N',
        click(menuItem, browserWindow) {
          console.log('nnn')
          browserWindow.webContents.send('newly-built-file')
        },
      },
      {
        label: '保存',
        accelerator: 'CmdOrCtrl+S',
        click(menuItem, browserWindow) {
          browserWindow.webContents.send('save-file')
        },
      },
      {
        label: '搜索',
        accelerator: 'CmdOrCtrl+F',
        click(menuItem, browserWindow) {
          browserWindow.webContents.send('search-file')
        },
      },
      {
        label: '导入',
        accelerator: 'CmdOrCtrl+O',
        click(menuItem, browserWindow) {
          browserWindow.webContents.send('import-file')
        },
      },
    ],
  },
  // { role: 'editMenu' }
  {
    label: '编辑',
    submenu: [
      { label: '撤销', role: 'undo', accelerator: 'CmdOrCtrl+Z' },
      { label: '重做', role: 'redo', accelerator: 'Shift+CmdOrCtrl+Z' },
      { type: 'separator' },
      { label: '剪切', role: 'cut', accelerator: 'CmdOrCtrl+X' },
      { label: '复制', role: 'copy', accelerator: 'CmdOrCtrl+C' },
      { label: '粘贴', role: 'paste', accelerator: 'CmdOrCtrl+V' },
      { label: '删除', role: 'delete', accelerator: 'CmdOrCtrl+D' },
      { type: 'separator' },
      { label: '全选', role: 'selectAll', accelerator: 'CmdOrCtrl+A' },
    ],
  },
  // { role: 'viewMenu' }
  {
    label: '视图',
    submenu: [
      { label: '刷新', role: 'reload', accelerator: 'CmdOrCtrl+R' },
      { label: '强制刷新', role: 'forcereload' },
      { label: '开发者工具', role: 'toggledevtools' },
      { type: 'separator' },
      { label: '恢复缩放', role: 'resetzoom' },
      { label: '放大', role: 'zoomin' },
      { label: '缩小', role: 'zoomout' },
      { type: 'separator' },
      { label: '切换全屏', role: 'togglefullscreen' },
    ],
  },
  // { role: 'windowMenu' }
  {
    label: '窗口',
    submenu: [
      { label: '最小化', role: 'minimize' },
      { label: '缩放', role: 'zoom' },
      ...(isMac ? [{ type: 'separator' }, { role: 'window' }] : [{ label: '关闭', role: 'close' }]),
    ],
  },
  {
    label: '帮助',
    role: 'help',
    submenu: [
      {
        label: '了解更多',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://electronjs.org')
        },
      },
    ],
  },
]

module.exports = menuTemplate

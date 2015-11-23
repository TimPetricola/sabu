var app = require('app')
var BrowserWindow = require('browser-window')
var Menu = require('menu')
var MenuItem = require('menu-item')
var packageJson = require('./package.json')
var hash = require('./lib/hash')
var ipc = require('./lib/ipc/host')
var Promise = require('promise')
var fs = require('fs')

var win = null
var devEnv = process.env.NODE_ENV === 'development'
var darwin = process.platform === 'darwin'
var name = app.getName()

var template = []

if (darwin) {
  template.push({
    label: name,
    submenu: [
      { label: 'About ' + name, role: 'about' },
      { label: 'Version ' + app.getVersion(), enabled: false },
      { type: 'separator' },
      { label: 'Services', role: 'services', submenu: [] },
      { type: 'separator' },
      { label: 'Hide ' + name, accelerator: 'Command+H', role: 'hide' },
      { label: 'Hide Others', accelerator: 'Command+Shift+H', role: 'hideothers' },
      { label: 'Show All', role: 'unhide' },
      { type: 'separator' },
      { label: 'Quit', accelerator: 'Command+Q', click: function () { app.quit() } }
    ]
  })
}

if (devEnv) {
  template.push({
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click: function(item, focusedWindow) {
          if (focusedWindow) { focusedWindow.reload()}
        }
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: (function() {
          return darwin ? 'Alt+Command+I' : 'Ctrl+Shift+I'
        })(),
        click: function(item, focusedWindow) {
          if (focusedWindow) { focusedWindow.toggleDevTools() }
        }
      },
    ]
  })
}

template.push({
  label: 'Window',
  submenu: [
    {
      label: 'Minimize',
      accelerator: 'CmdOrCtrl+M',
      role: 'minimize'
    },
    {
      label: 'Close',
      accelerator: 'CmdOrCtrl+W',
      role: 'close'
    },
  ]
})

template.push({
  label: 'Help',
  role: 'help',
  submenu: [{
    label: 'Learn More',
    click: function() {
      require('shell').openExternal(packageJson.homepage)
    }
  }]
})

app.on('window-all-closed', function () {
  app.quit()
})

const pathsToOpen = []
const addPathToOpen = function (event, path) {
  e.preventDefault()
  pathsToOpen.push(path)
}

app.on('open-file', addPathToOpen)

app.on('ready', function () {
  app.removeListener('open-file', addPathToOpen)

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))

  ipc.on('file-hash', function (resolve, reject, path) {
    hash.hashAndSize(path).then(resolve).catch(reject)
  })

  win = new BrowserWindow({
    title: 'Sabu',
    width: 400,
    height: 400,
    'min-width': 400,
    'min-height': 250,
    center: true,
    'title-bar-style': 'hidden-inset'
  })

  win.loadUrl('file://' + __dirname + '/app/index.html')

  win.webContents.on('did-finish-load', function() {
    if (pathsToOpen.length) {
      win.webContents.send('open-paths', pathsToOpen)
    }
  });

  win.on('closed', function () {
    win = null
  })
})

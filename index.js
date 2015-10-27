var app = require('app')
var BrowserWindow = require('browser-window')
var Menu = require('menu')
var MenuItem = require('menu-item')
var packageJson = require('./package.json')

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
  if (!darwin) {
    app.quit()
  }
})

app.on('ready', function () {
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))

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

  win.on('closed', function () {
    win = null
  })
})

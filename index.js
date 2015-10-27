var app = require('app')
var BrowserWindow = require('browser-window')

var win = null

app.on('window-all-closed', function () {
  if (process.platform != 'darwin') {
    app.quit()
  }
})

app.on('ready', function () {
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

var rimraf = require('rimraf')
var webpack = require('webpack')
var packager = require('electron-packager')

var packageJson = require('./package.json')
var webpackConfig = require('./webpack.config.js')

var compiler = webpack(webpackConfig)

console.log('Compiling assets...')
webpack(webpackConfig).run(function() {
  console.log('Assets compiled.')

  packager({
    dir: '.',
    name: 'Sabu',
    icon: 'sabu.icns',
    platform: 'darwin',
    arch: 'x64',
    version: '0.34.0',
    out: 'dist',
    overwrite: true,
    prune: true,
    asar: true,
    'app-version': packageJson.version,
    'app-bundle-id': 'com.timpetricola.sabu'
  }, function() {
    console.log('App packaged.')

    console.log('Cleaning assets...')
    rimraf('./app/dist', {}, function() {
      console.log('Assets cleaned.')
      console.log('Done.')
    })
  })
})



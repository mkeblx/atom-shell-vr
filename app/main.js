var app = require('app');
var BrowserWindow = require('browser-window');

var fs = require('fs');
var ipc = require('ipc');

require('crash-reporter').start();

var mainWindow = null;

app.on('window-all-closed', function(){
  app.quit();
});

var pluginsDir = __dirname + '/plugins/';

//  width: 1280,
//  height: 800,
var options = {
  title: 'test',
  'use-content-size': true,
  fullscreen: true,
  frame: 0,
  resizable: true,
  show: true,
  'always-on-top': false,
  center: true,
  'accept-first-mouse': false,
  kiosk: false,
  'node-integration': 'all',

  'web-preferences': {
    javascript: true,
    'web-security': false,
    java: false,
    webgl: true,
    'accelerated-compositing': true,
    plugins: true,
    'extra-plugin-dirs': [ pluginsDir ]
  }
};

app.on('ready', function(){
  mainWindow = new BrowserWindow(options);

  mainWindow.loadUrl('file://' + __dirname + '/vrjs.html');

  mainWindow.openDevTools();

  mainWindow.on('closed', windowClosed);
});

function windowClosed() {
  console.log(pluginsDir);
  console.log('closing window... :)' + pluginsDir);
  mainWindow = null;
}

ipc.on('msg', function(event, arg){
  event.sender.send('msg', 'msg received');

  if (arg == 'close') {
    mainWindow.close();
  }
});

process.on('error', function(err) {
  console.log(err);
});
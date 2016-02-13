import electron from 'electron';
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

import fs from 'fs';
import os from 'os';

import path from 'path';
import child_process from 'child_process';

var isWin = process.platform === 'win32';

process.env.NODE_PATH = path.join(__dirname, 'node_modules');
process.env.RESOURCES_PATH = path.join(__dirname, '/../resources');
if (!isWin) {
  process.env.PATH = '/usr/local/bin:' + process.env.PATH;
}

var size = {};
try {
  size = JSON.parse(fs.readFileSync(path.join(process.env[isWin ? 'USERPROFILE' : 'HOME'], 'Library', 'Application\ Support', 'Kitematic', 'size')));
} catch (err) {}


app.on('ready', function () {
  var mainWindow = new BrowserWindow({
    width: size.width || 1080,
    height: size.height || 680,
    'min-width': os.platform() === 'win32' ? 400 : 700,
    'min-height': os.platform() === 'win32' ? 260 : 500,
    'standard-window': false,
    resizable: true,
    frame: false,
    show: false
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.openDevTools({detach: true});
  }

  mainWindow.loadURL(path.normalize('file://' + path.join(__dirname, 'index.html')));

  app.on('activate-with-no-open-windows', function () {
    if (mainWindow) {
      mainWindow.show();
    }
    return false;
  });

  if (os.platform() === 'win32') {
    mainWindow.on('close', function () {
      mainWindow.webContents.send('application:quitting');
      return true;
    });

    app.on('window-all-closed', function () {
      app.quit();
    });
  } else if (os.platform() === 'darwin') {
    app.on('before-quit', function () {
      mainWindow.webContents.send('application:quitting');
    });
  }

  mainWindow.webContents.on('new-window', function (e) {
    e.preventDefault();
  });

  mainWindow.webContents.on('will-navigate', function (e, url) {
    if (url.indexOf('build/index.html#') < 0) {
      e.preventDefault();
    }
  });

  mainWindow.webContents.on('did-finish-load', function () {
    mainWindow.setTitle('XPath Tool');
    mainWindow.show();
    mainWindow.focus();
  });
});
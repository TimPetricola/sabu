"use strict";

import { app, BrowserWindow, Menu, MenuItemConstructorOptions } from "electron";
import * as path from "path";
import { format as formatUrl } from "url";
import ipc from "./ipc";
import { hashAndSize } from "./hash";
import fs from "fs";
import http from "http";
import zlib from "zlib";
// var packageJson = require("../package.json");

const isDevelopment = process.env.NODE_ENV !== "production";
const isDarwin = true; //process.platform === "darwin";
const name = app.getName();

let mainWindow: BrowserWindow | null;

const template: MenuItemConstructorOptions[] = [];

if (isDarwin) {
  template.push({
    label: name,
    submenu: [
      { label: "About " + name, role: "about" },
      { label: "Version " + app.getVersion(), enabled: false },
      { type: "separator" },
      { label: "Services", role: "services", submenu: [] },
      { type: "separator" },
      { label: "Hide " + name, accelerator: "Command+H", role: "hide" },
      {
        label: "Hide Others",
        accelerator: "Command+Shift+H",
        role: "hideothers"
      },
      { label: "Show All", role: "unhide" },
      { type: "separator" },
      {
        label: "Quit",
        accelerator: "Command+Q",
        click: function() {
          app.quit();
        }
      }
    ]
  });
}

if (isDevelopment) {
  template.push({
    label: "View",
    submenu: [
      {
        label: "Reload",
        accelerator: "CmdOrCtrl+R",
        click: (_item: any, focusedWindow: any) => {
          if (focusedWindow) focusedWindow.reload();
        }
      },
      {
        label: "Toggle Developer Tools",
        accelerator: (function() {
          return isDarwin ? "Alt+Command+I" : "Ctrl+Shift+I";
        })(),
        click: (_item: any, focusedWindow: any) => {
          if (focusedWindow) focusedWindow.toggleDevTools();
        }
      }
    ]
  });
}

template.push({
  label: "Window",
  submenu: [
    {
      label: "Minimize",
      accelerator: "CmdOrCtrl+M",
      role: "minimize"
    },
    {
      label: "Close",
      accelerator: "CmdOrCtrl+W",
      role: "close"
    }
  ]
});

template.push({
  label: "Help",
  role: "help",
  submenu: [
    {
      label: "Learn More",
      click: function() {
        // require("shell").openExternal(packageJson.homepage);
      }
    }
  ]
});

app.on("window-all-closed", () => {
  app.quit();
});

function createMainWindow() {
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  ipc.on("file-hash", (resolve: any, reject: any, path: string) => {
    hashAndSize(path)
      .then(resolve)
      .catch(reject);
  });

  ipc.on(
    "sub-download",
    (
      resolve: any,
      reject: any,
      options: { downloadLink: string; subPath: string }
    ) => {
      const subFile = fs.createWriteStream(options.subPath);

      const request = http.get(options.downloadLink, response => {
        const gunzip = zlib.createGunzip();

        response.pipe(gunzip).pipe(subFile);

        subFile.on("close", function() {
          response.unpipe(gunzip);
          response.unpipe(subFile);

          resolve();
        });

        gunzip.on("error", () => {
          fs.unlink(options.subPath, reject);
        });
      });

      request.on("error", () => {
        fs.unlink(options.subPath, reject);
      });
    }
  );

  mainWindow = new BrowserWindow({
    title: "Sabu",
    width: 400,
    height: 400,
    minWidth: 400,
    minHeight: 250,
    center: true,
    titleBarStyle: "hiddenInset",
    webPreferences: { nodeIntegration: true }
  });

  if (isDevelopment) mainWindow.webContents.openDevTools();

  if (isDevelopment) {
    mainWindow.loadURL(
      `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`
    );
  } else {
    mainWindow.loadURL(
      formatUrl({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file",
        slashes: true
      })
    );
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", createMainWindow);

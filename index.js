const electron = require("electron");
const { app, BrowserWindow, ipcMain, screen } = electron;
const db = require("./config/database/config-db");
const remote = require("@electron/remote/main");
remote.initialize();

let mainWindow;
let productWindow;
let editDataModal;

const mainWin = () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    height: 715,
    autoHideMenuBar: true,
    title: "My POS 1.0.0",
  });
  // mainWindow.webContents.openDevTools();
  mainWindow.setResizable(false);
  mainWindow.loadFile("index.html");
};

app.on("ready", () => {
  mainWin();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWin();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

//communication with rendererProcess (front end)
ipcMain.on("load:product-window", () => {
  productWin();
});

const productWin = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  productWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    autoHideMenuBar: true,
    width,
    height,
    title: "My POS | Product",
  });
  // productWindow.webContents.openDevTools();
  productWindow.loadFile("windows/product.html");

  remote.enable(productWindow.webContents);

  productWindow.webContents.on("did-finish-load", () => {
    mainWindow.hide();
  });
  productWindow.on("close", () => {
    mainWindow.show();
  });
};

const editData = (docId, editForm, width, height, rowId) => {
  let parentWin;
  switch (docId) {
    case "product-data":
      parentWin = productWindow;
  }

  editDataModal = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    autoHideMenuBar: true,
    width,
    height,
    resizable: false,
    maximizable: false,
    minimizable: false,
    parent: parentWin,
    title: "Edit product data",
  });
  remote.enable(editDataModal.webContents);
  // editDataModal.webContents.openDevTools();
  editDataModal.loadFile("modals/edit-data.html");
  editDataModal.webContents.on("did-finish-load", () => {
    editDataModal.webContents.send("res:form", docId, editForm, rowId);
  });
  editDataModal.on("close", () => {
    editDataModal = null;
  });
};

ipcMain.on("load:edit", (event, docId, editForm, width, height, rowId) => {
  editData(docId, editForm, width, height, rowId);
});

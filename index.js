const electron = require("electron");
const { app, BrowserWindow, ipcMain, screen } = electron;

let mainWindow;
let productWindow;

const mainWin = () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    height: 550,
    autoHideMenuBar: true,
    title: "My POS 1.0.0",
  });
  // mainWindow.webContents.openDevTools();
  mainWindow.setResizable(false);
  mainWindow.loadFile("index.html");
};

app.on("ready", () => {
  mainWin();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWin()
    }
  })
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

//communication with rendererProcess (front end)
ipcMain.on("load:product-window", () => {
  productWin()
})

const productWin = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  productWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    autoHideMenuBar: true,
    width,
    height,
    title: "My POS | Product"
  })
  // productWindow.webContents.openDevTools();
  productWindow.loadFile("windows/product.html");

  productWindow.webContents.on("did-finish-load", () => {
    mainWindow.hide();
  })
  productWindow.on("close", () => {
    mainWindow.show();
  })

}
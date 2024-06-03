const electron = require("electron");
const { app, BrowserWindow } = electron;

let mainWindow;

const mainWin = () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
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
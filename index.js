const electron = require("electron");
const { app, BrowserWindow } = electron;

let mainWindow;

mainWin = () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
    },
    height: 550,
    rezisable: false,
    autoHideMenuBar: true,
    title: "My POS 1.0.0",
  });

  mainWindow.loadFile("index.html");
};

app.on("ready", () => {
  mainWin();
});

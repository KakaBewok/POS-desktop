const electron = require("electron");
const { app, BrowserWindow, ipcMain, screen, dialog } = electron;
const db = require("./config/database/config-db");
const remote = require("@electron/remote/main");
const fs = require("fs");
const path = require("path");
const url = require("url");
const md5 = require("md5");
remote.initialize();

let mainWindow;
let productWindow;
let editDataModal;

let toPdf;

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
  productWindow.webContents.openDevTools();
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

ipcMain.on("update:success", (e, docId) => {
  switch (docId) {
    case "product-data":
      productWindow.webContents.send("update:success", "Successfully update");
  }
  editDataModal.close();
});

const writeCsv = (filePath, content) => {
  fs.writeFile(filePath, content, (err) => {
    if (err) throw err;

    dialog.showMessageBoxSync({
      title: "Alert",
      type: "info",
      message: "CSV file created",
    });
  });
};

ipcMain.on("write:csv", (e, filePath, content) => {
  writeCsv(filePath, content);
});

const loadToPdf = (thead, tbody, filePath, docId = false, title) => {
  toPdf = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    show: false,
  });

  let dt = new Date();
  let day = dt.getDate().toString().padStart(2, 0);
  let month = dt.getMonth().toString().padStart(2, 0);
  let year = dt.getFullYear();
  let today = `${day}/${month}/${year}`;

  let titleObject = {
    title,
    date: today,
  };

  let sql = `select * from profile order by id asc limit 1`;
  db.all(sql, (err, row) => {
    if (err) throw err;

    if (row.length < 1) {
      titleObject.storeName = "My Store";
      titleObject.storeAddress = "Address";
      titleObject.storeLogo = "shop.png";
    } else {
      titleObject.storeName = row[0].store_name;
      titleObject.storeAddress = row[0].address;
      if (row[0].logo == null || row[0].logo == "") {
        titleObject.storeLogo = "shop.png";
      } else {
        titleObject.storeLogo = row[0].logo;
      }
    }
  });

  switch (docId) {
    case "sales-report":
      toPdf.loadFile("export-pdf/sales-record-pdf.html");
      break;
    default:
      toPdf.loadFile("export-pdf/toPdf.html");
  }

  toPdf.webContents.on("dom-ready", () => {
    toPdf.webContents.send("load:table-to-pdf", thead, tbody, titleObject);
  });

  toPdf.webContents.on("did-finish-load", () => {
    toPdf.webContents
      .printToPdf({
        marginsType: 0,
        printBackground: true,
        printSelectionOnly: false,
        landscape: true,
      })
      .then((data) => {
        fs.writeFile((filePath, data, err) => {
          if (err) throw err;

          toPdf.close();

          dialog.showMessageBoxSync({
            title: "Alert",
            type: "info",
            message: "Successfully export data to PDF",
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

ipcMain.on("load:to-pdf", (e, thead, tbody, filePath, docId, title) => {
  loadToPdf(thead, tbody, filePath, docId, title);
});

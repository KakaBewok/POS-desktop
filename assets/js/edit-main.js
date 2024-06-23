// const { ipcRenderer } = require("electron/renderer");

let id;

ipcRenderer.on("res:form", (event, docId, editForm, rowId) => {
  $("#edit-form").html(editForm);
});

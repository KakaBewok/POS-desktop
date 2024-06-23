let docId;
let id;
ipcRenderer.on("res:form", (event, editDocId, editForm, rowId) => {
  $("#edit-form").html(editForm);
  docId = editDocId;
  id = rowId;
});

const submitEditData = (id) => {
  switch (docId) {
    case "product-data":
      submitEditProductData(id);
      break;
  }
};

//click ENTER to submit edit product data
$("body").keydown(function (e) {
  if (e.keyCode === 13) {
    submitEditProductData(id);
  }
});

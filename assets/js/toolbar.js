const openFormAddData = () => {
  $("#form-add-data").removeClass("hidden");
  $("#table-separator").removeClass("hidden");
  $("#product-name").focus();
  loadCategoryOption();
  loadUnitOption();
};

const closeFormAddData = () => {
  $("#form-add-data").addClass("hidden");
  $("#table-separator").addClass("hidden");
};

const deleteAction = (id = null, producName = null) => {
  const message = `Are you sure, you want to delete data "${producName}" ?`;

  if (id) {
    let dialogBox = dialog.showMessageBoxSync({
      title: "Delete record",
      type: "question",
      buttons: ["Yes", "No"],
      defaultId: 0,
      message,
      detail: "This action cannot be undone.",
    });
    if (dialogBox === 1) {
      $("input.data-checkbox").prop("checked", false);
      $("tbody#data tr").removeClass("blocked");
    } else {
      deleteRecord(id);
    }
  }
};

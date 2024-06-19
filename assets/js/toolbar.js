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
  const messageDeleteOne = `Are you sure, you want to delete data "${producName}" ?`;
  const messageDeleteAll = `Are you sure you want to delete all records ?`;

  if (id) {
    let dialogBox = dialog.showMessageBoxSync({
      title: "Delete record",
      type: "question",
      buttons: ["Yes", "No"],
      defaultId: [0, 1],
      message: messageDeleteOne,
      detail: "This action cannot be undone.",
    });
    if (dialogBox === 1) {
      $(`input.data-checkbox#${id}`).prop("checked", false);
    } else {
      deleteRecord(id);
    }
  } else {
    let arrayIds = [];
    $("input.data-checkbox:checked").each(function () {
      let ids = $(this).attr("id");
      arrayIds.push(ids);
    });

    if (arrayIds.length < 1) {
      let dialogBox = dialog.showMessageBoxSync({
        title: "Delete all records",
        type: "question",
        buttons: ["Yes", "No"],
        defaultId: 1,
        message: messageDeleteAll,
        detail: "This action cannot be undone.",
      });

      if (dialogBox === 1) {
        unSelectAll();
      } else {
        deleteAllRecords();
      }
    } else {
      let dialogBox = dialog.showMessageBoxSync({
        title: "Delete many records",
        type: "question",
        buttons: ["Yes", "No"],
        defaultId: 0,
        message: `Are you sure you want to delete ${arrayIds.length} selected records ?`,
        detail: "This action cannot be undone.",
      });
      if (dialogBox === 1) {
        unSelectAll();
      } else {
        const joinArrayIds = arrayIds.join(", ");
        deleteMultipleRecords(joinArrayIds);
      }
    }
  }
};

const selectAll = () => {
  $("input.data-checkbox").prop("checked", true);
  $("tbody#data tr").addClass("bg-slate-900 text-white");
};

const unSelectAll = () => {
  $("input.data-checkbox").prop("checked", false);
  $("tbody#data tr").removeClass("bg-slate-900 text-white");
};

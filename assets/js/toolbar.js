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
  $("tbody#data tr").addClass("bg-cyan-600 text-white");
};

const unSelectAll = () => {
  $("input.data-checkbox").prop("checked", false);
  $("tbody#data tr").removeClass("bg-cyan-600 text-white");
};

//pagiantion
$("#first-page").click(function (e) {
  e.preventDefault();
  let totalRowDisplayed = $("#row-per-page").val();
  $("#page-number").val(1);
  loadData(1, totalRowDisplayed);
});
$("#last-page").click(function (e) {
  e.preventDefault();
  let totalPage = $("#total-page").val();
  $("#page-number").val(totalPage);
  let totalRowDisplayed = $("#row-per-page").val();
  loadData(totalPage, totalRowDisplayed);
});
$("#page-number").keyup(function () {
  let pageNumber = $(this).val();
  let totalRowDisplayed = $("#row-per-page").val();
  loadData(pageNumber, totalRowDisplayed);
});
$("#next-page").click(function (e) {
  e.preventDefault();
  let totalPage = $("#total-page").val();
  let inputPageNumber = $("#page-number").val();
  if (inputPageNumber == "") {
    inputPageNumber = 1;
  }

  let pageNumber = parseInt(inputPageNumber);
  let totalRowDisplayed = $("#row-per-page").val();
  if (pageNumber < totalPage) {
    $("#page-number").val(pageNumber + 1);
    loadData(pageNumber + 1, totalRowDisplayed);
  }
});
$("#prev-page").click(function (e) {
  e.preventDefault();

  let inputPageNumber = $("#page-number").val();
  let pageNumber = parseInt(inputPageNumber);

  if (pageNumber > 1) {
    $("#page-number").val(pageNumber - 1);
    let totalRowDisplayed = $("#row-per-page").val();
    loadData(pageNumber - 1, totalRowDisplayed);
  }
});
$("#row-per-page").change(function () {
  let totalRowDisplayed = $(this).val();
  let pageNumber = $("#page-number").val();
  let totalPage = $("#total-page").val();

  if (pageNumber > totalPage) {
    pageNumber = 1;
    $("#page-number").val(1);
  }
  loadData(pageNumber, totalRowDisplayed);
});

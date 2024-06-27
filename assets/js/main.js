let docId = $("body").attr("id");

const loadData = () => {
  switch (docId) {
    case "product-data":
      loadProduct();
      break;
  }
};

loadData();

const deleteRecord = (id) => {
  let table;
  switch (docId) {
    case "product-data":
      table = `product`;
      break;
  }
  const queryDelete = `delete from ${table} where id = ${id}`;

  db.run(queryDelete, (err) => {
    if (err) {
      console.log(err);
      throw err;
    } else {
      dialog.showMessageBoxSync({
        title: "Alert",
        message: "Deleted",
        type: "info",
        buttons: ["OK"],
      });
      loadData();
    }
  });
};

const deleteAllRecords = () => {
  let table;
  switch (docId) {
    case "product-data":
      table = `product`;
      break;
  }
  const queryDeleteAll = `delete from ${table}`;

  db.run(queryDeleteAll, (err) => {
    if (err) {
      console.log(err);
      throw err;
    } else {
      dialog.showMessageBoxSync({
        title: "Alert",
        message: "Deleted",
        type: "info",
        buttons: ["OK"],
      });
      loadData();
    }
  });
};

const deleteMultipleRecords = (ids) => {
  let table;
  switch (docId) {
    case "product-data":
      table = `product`;
      break;
  }
  const queryDeleteMultiple = `delete from ${table} where id IN(${ids})`;

  db.run(queryDeleteMultiple, (err) => {
    if (err) {
      console.log(err);
      throw err;
    } else {
      dialog.showMessageBoxSync({
        title: "Alert",
        message: "Deleted",
        type: "info",
        buttons: ["OK"],
      });
      loadData();
    }
  });
};

const editRecord = (id) => {
  switch (docId) {
    case "product-data":
      editProduct(id);
      break;
  }
};

//checkbox checked
$("tbody#data").on("click", "tr", function (event) {
  if (
    !$(event.target).is("button") &&
    !$(event.target).closest("button").length
  ) {
    let dataId = $(this).attr("data-id");
    let checkbox = $("input[type='checkbox']#" + dataId);
    checkbox.prop("checked", !checkbox.prop("checked"));

    checkbox.prop("checked")
      ? $(this).addClass("bg-cyan-600 text-white")
      : $(this).removeClass("bg-cyan-600 text-white");
  }
});

const alertSuccess = (message) => {
  let div = "";
};

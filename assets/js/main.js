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
  let div = `
            <div role="alert" class="alert alert-success rounded-none text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                class="stroke-info h-6 w-6 shrink-0">
                <path
                  stroke="white"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>${message}</span>
            </div>
            `;
  $("#alert").html(div);
  const clearAlert = () => {
    $("#alert").html("");
  };
  setTimeout(clearAlert, 4000);
};

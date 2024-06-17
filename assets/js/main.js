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

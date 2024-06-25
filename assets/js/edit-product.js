const submitEditProductData = (rowId) => {
  let productName = $("#edit-form").find("#edit-product-name").val();
  let prevProductName = $("#edit-form").find("#prev-product-name").val();
  let barcode = $("#edit-form").find("#edit-barcode").val();
  let prevBarcode = $("#edit-form").find("#prev-barcode").val();

  let sellingPrice = $("#edit-form").find("#edit-selling-price").val();
  let productCost = $("#edit-form").find("#edit-product-cost").val();
  let productInitialQty = $("#edit-form")
    .find("#edit-product-initial-qty")
    .val();

  if (productName === "" || productCost === "" || sellingPrice === "") {
    dialog.showMessageBoxSync({
      title: "Alert",
      type: "info",
      message: "Product name, product price and product cost are required.",
    });
  } else {
    if (productName === prevProductName) {
      if (barcode === "" || barcode === prevBarcode) {
        executeEditProductData(rowId);
      } else {
        const query = `select count(*) as count from product where barcode = ${barcode}`;
        db.all(query, (err, row) => {
          if (err) throw err;

          const rowNumber = row[0].count;
          if (rowNumber < 1) {
            executeEditProductData(rowId);
          } else {
            dialog.showMessageBoxSync({
              title: "Alert",
              type: "info",
              message: `Barcode ${barcode} already exist!`,
            });
          }
        });
      }
    } else {
      const query = `select count(*) as count from product where product_name = ${productName}`;
      db.all(query, (err, row) => {
        if (err) console.log(err);

        const rowNumber = row[0].count;
        if (rowNumber < 1) {
          if (barcode === "" || barcode === prevBarcode) {
            executeEditProductData(rowId);
          } else {
            const query = `select count(*) as count from product where barcode = ${barcode}`;
            db.all(query, (err, row) => {
              if (err) throw err;

              const rowNumber = row[0].count;
              if (rowNumber < 1) {
                executeEditProductData(rowId);
              } else {
                dialog.showMessageBoxSync({
                  title: "Alert",
                  type: "info",
                  message: `Barcode ${barcode} already exist!`,
                });
              }
            });
          }
        } else {
          dialog.showMessageBoxSync({
            title: "Alert",
            type: "info",
            message: `${productName} already exist!`,
          });
        }
      });
    }
  }
};

const executeEditProductData = (rowId) => {};

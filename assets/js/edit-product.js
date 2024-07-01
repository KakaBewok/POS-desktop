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
        const query = `select count(*) as count from product where barcode = '${barcode}'`;
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
      const query = `select count(*) as count from product where product_name = '${productName}'`;
      db.all(query, (err, rows) => {
        if (err) console.log(err);

        console.log(rows);

        const rowNumber = rows[0].count;
        if (rowNumber < 1) {
          if (barcode === "" || barcode === prevBarcode) {
            executeEditProductData(rowId);
          } else {
            const query = `select count(*) as count from product where barcode = '${barcode}'`;
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

const executeEditProductData = (rowId) => {
  let productName = $("#edit-form").find("#edit-product-name").val();
  let barcode = $("#edit-form").find("#edit-barcode").val();
  let category = $("#edit-form").find("#edit-product-category").val();
  let sellingPrice = $("#edit-form").find("#edit-selling-price").val();
  let productCost = $("#edit-form").find("#edit-product-cost").val();
  let productInitialQty = $("#edit-form")
    .find("#edit-product-initial-qty")
    .val();
  let unit = $("#edit-form").find("#edit-product-unit").val();

  if (sellingPrice < productCost) {
    dialog.showMessageBoxSync({
      title: "Alert",
      type: "info",
      message: `Product price must be greater than product cost!`,
    });
  } else {
    const query = `update 
                    product
                  set 
                    product_name = ?,
                    barcode = ?,
                    category = ?,
                    selling_price = ?,
                    cost_of_product = ?,
                    product_initial_qty = ?,
                    unit = ?
                  where
                    id = ?`;

    db.serialize(() => {
      db.run(
        query,
        [
          productName,
          barcode === "" || barcode === " " ? "-" : barcode,
          category,
          sellingPrice,
          productCost,
          productInitialQty === "" || productInitialQty === " "
            ? "-"
            : productInitialQty,
          unit,
          rowId,
        ],
        (err) => {
          if (err) throw err;

          ipcRenderer.send("update:success", "product-data");
        }
      );
    });
  }
};

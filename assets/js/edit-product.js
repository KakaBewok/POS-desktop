const submitEditProductData = (id) => {
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
        executeEditProductData(id);
      } else {
        const sql = `select count(*) as count from product where barcode = ${barcode}`;
      }
    }
  }
};

const loadProduct = () => {
  const query = `SELECT * FROM product`;

  db.serialize(() => {
    db.all(query, (err, rows) => {
      if (err) throw err;
      let result = null;

      if (rows.length < 1) {
        result += "";
      } else {
        rows.forEach((row) => {
          result += `
                        <tr data-id=${row.id} >
                            <td></td>
                            <td>${row.product_name}</td>
                            <td>${row.product_code}</td>
                            <td>${row.barcode}</td>
                            <td>${row.category}</td>
                            <td>${row.selling_price}</td>
                            <td>${row.cost_of_product}</td>
                            <td>${row.product_initial_qty}</td>
                            <td>${row.unit}</td>
                            <td>
                                <button
                                    class="px-3 py-1 text-xs font-medium text-white rounded-sm btn btn-xs btn-accent"
                                >
                                    <i class="fa fa-edit"></i>
                                </button>
                                <button
                                    class="px-3 py-1 text-xs font-medium text-white rounded-sm btn btn-xs btn-error"
                                >
                                    <i class="fa fa-trash"></i>
                                </button>
                            </td>
                        </tr>
            `;
        });
      }
      $("tbody#data").html(result);
    });
  });
};

const blankForm = () => {
  $("#product-name").val("");
  $("#product-code").val("");
  $("#product-category").val("Category");
  $("#product-price").val("");
  $("#product-cost").val("");
  $("#product-initial-stock").val("");
  $("#product-unit").val("Unit");
  $("#product-barcode").val("");
};

const insertProduct = () => {
  let productName = $("#product-name").val();
  let productCode = $("#product-code").val();
  let productCategory = $("#product-category").val();
  let productPrice = inputProductPrice.unmaskedValue;
  let productCost = inputProductCost.unmaskedValue;
  let productInitialStock = $("#product-initial-stock").val();
  let productUnit = $("#product-unit").val();
  let productBarcode = $("#product-barcode").val();

  let required = $("[required]");
  let requiredArray = [];
  required.each(function () {
    if ($(this).val() != "") {
      requiredArray.push($(this).val());
    }
  });

  if (requiredArray.includes(null)) {
    dialog.showMessageBoxSync({
      title: "Alert",
      type: "info",
      message:
        "Product name, product price, product cost and unit must be filled in.",
    });
  } else if (
    parseInt(inputProductPrice.unmaskedValue) <
    parseInt(inputProductCost.unmaskedValue)
  ) {
    dialog.showMessageBoxSync({
      title: "Alert",
      type: "info",
      message: "Product price must be greater than product cost",
    });
  } else {
    let query = `
                insert into product
                (
                  product_name,
                  product_code,
                  category,
                  selling_price,
                  cost_of_product,
                  product_initial_qty,
                  unit,
                  barcode
                )
                values
                (
                '${productName}',
                '${productCode}',
                '${productCategory}',
                '${productPrice}',
                '${productCost}',
                '${productInitialStock}',
                '${productUnit}',
                '${productBarcode}'
                );
              `;
    db.serialize(() => {
      db.run(query, (err) => {
        if (err) {
          throw err;
        } else {
          dialog.showMessageBoxSync({
            title: "Alert",
            message: "Success",
            type: "info",
            buttons: ["OK"],
          });
          blankForm();
          $("#product-name").focus();
          loadData();
        }
      });
    });
  }
};

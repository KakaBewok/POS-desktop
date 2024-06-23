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
                            <td data-colname="Id" class="flex items-center gap-2" >
                              ${row.id}
                              <input type='checkbox' class="hidden data-checkbox" id=${row.id}></input>
                            </td>
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
                                    onclick="editRecord(${row.id})"
                                    id="edit-data"
                                >
                                    <i class="fa fa-edit"></i>
                                </button>
                                <button
                                    class="px-3 py-1 text-xs font-medium text-white rounded-sm btn btn-xs btn-error"
                                    onclick="deleteAction(${row.id}, '${row.product_name}')"
                                    id="delete-data"
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
  let productCategory = $("#product-category").val();
  let productPrice = inputProductPrice.unmaskedValue;
  let productCost = inputProductCost.unmaskedValue;
  let productInitialStock = inputProductInitialStock.unmaskedValue;
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
    let queryInsert = `
                insert into product
                (
                  product_name,
                  category,
                  selling_price,
                  cost_of_product,
                  product_initial_qty,
                  unit,
                  barcode
                )
                values
                (
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?
                );
              `;
    let queryCheckUniqueData = `select count(*) as row_number from product where product_name = ?`;
    let queryGenerateProductCode = `select id from product where product_name = ?`;
    let queryUpdateProductCode = `UPDATE product SET product_code = 'PR'||substr('000000'||?, -6, 6) WHERE product_name = ?`;

    db.serialize(() => {
      //check product name already exist ?
      db.each(queryCheckUniqueData, [productName], (err, res) => {
        if (err) throw err;
        if (res.row_number < 1) {
          ("");
          db.run(
            queryInsert,
            [
              productName,
              productCategory,
              productPrice,
              productCost,
              productInitialStock,
              productUnit,
              productBarcode,
            ],
            (err) => {
              if (err) {
                throw err;
              } else {
                dialog.showMessageBoxSync({
                  title: "Alert",
                  message: "Success",
                  type: "info",
                  buttons: ["OK"],
                });
                //generate product code
                db.each(queryGenerateProductCode, [productName], (err, row) => {
                  if (err) throw err;
                  db.run(
                    queryUpdateProductCode,
                    [row.id, productName],
                    (err) => {
                      if (err) throw err;
                      blankForm();
                      $("#product-name").focus();
                      loadData();
                    }
                  );
                });
              }
            }
          );
        } else {
          dialog.showMessageBoxSync({
            title: "Alert",
            type: "info",
            message: "Product name already exist",
          });
        }
      });
      //
    });
  }
};

const loadCategoryOption = () => {
  const queryGetAllCategories = "select * from category order by id desc";
  db.all(queryGetAllCategories, (err, rows) => {
    if (err) throw err;
    let option = "<option selected disabled>Category</option>";
    rows.map((row) => {
      option += `<option>${row.category}</option>`;
    });
    $("#product-category").html(option);
  });
};

const loadUnitOption = () => {
  const queryGetAllUnits = "select * from unit order by id desc";
  db.all(queryGetAllUnits, (err, rows) => {
    if (err) throw err;
    let option = " <option selected disabled>Unit</option>";
    rows.map((row) => {
      option += `<option>${row.unit}</option>`;
    });
    $("#product-unit").html(option);
  });
};

const selectUnitOption = (unitOption, selectedUnit) => {
  let options = unitOption.replace(
    `<option>${selectedUnit}</option>`,
    `<option selected>${selectedUnit}</option>`
  );
  return options;
};

const selectCategoryOption = (categoryOption, selectedCategory) => {
  let options = categoryOption.replace(
    `<option>${selectedCategory}</option>`,
    `<option selected>${selectedCategory}</option>`
  );
  return options;
};

const editProduct = (id) => {
  const sqlUnits = `SELECT * FROM unit`;
  const sqlCategories = `SELECT * FROM category`;
  const sqlProductEdit = `SELECT * FROM product WHERE id = ${id}`;

  db.all(sqlUnits, (err, rows) => {
    if (err) throw err;
    let unitOption = "";
    rows.map((row) => {
      unitOption += `<option>${row.unit}</option>`;
    });

    db.all(sqlCategories, (err, rows) => {
      if (err) throw err;
      let categoryOption = "";
      rows.map((row) => {
        categoryOption += `<option>${row.category}</option>`;
      });

      db.all(sqlProductEdit, (err, rows) => {
        if (err) throw err;

        let row = rows[0];
        let editForm = `
                      <div class="flex flex-col gap-2" >
                        <div>
                           <input
                              type="text"
                              class="w-full rounded-sm input-xs input input-bordered border-slate-400 text-slate-100"
                              id="edit-product-name"
                              value=${row.product_name}
                              required
                            />
                            <input
                              type="hidden"
                              class="w-full rounded-sm input-xs input input-bordered border-slate-400 text-slate-700"
                              id="prev-product-name"
                              value=${row.product_name}
                              required
                            />
                            <input
                              type="hidden"
                              class="w-full rounded-sm input-xs input input-bordered border-slate-400 text-slate-700"
                              id="row-id"
                              value=${id}
                              required
                            />
                        </div>
                        <div>
                           <input
                              type="text"
                              placeholder="Barcode"
                              class="w-full rounded-sm input-xs input input-bordered border-slate-400 text-slate-100"
                              id="edit-barcode"
                              value=${row.barcode}
                              required
                            />
                            <input
                              type="hidden"
                              placeholder="Barcode"
                              class="w-full rounded-sm input-xs input input-bordered border-slate-400 text-slate-700"
                              id="prev-barcode"
                              value=${row.barcode}
                              required
                            />
                        </div>
                        <div>
                          <select
                            class="rounded-sm w-full select select-xs select-bordered border-slate-400"
                            id="edit-product-category"
                          >
                            ${selectCategoryOption(
                              categoryOption,
                              row.category
                            )}
                          </select>
                        </div>
                        <div>
                          <select
                            class="rounded-sm w-full select select-xs select-bordered border-slate-400"
                            id="edit-product-unit"
                          >
                            ${selectUnitOption(unitOption, row.unit)}
                          </select>
                        </div>
                        <div>
                           <input
                              type="text"
                              placeholder="Seling price"
                              class="w-full rounded-sm input-xs input input-bordered border-slate-400 text-slate-100"
                              id="edit-selling-price"
                              value=${row.selling_price}
                              required
                            />
                        </div>
                        <div>
                           <input
                              type="text"
                              placeholder="Product cost"
                              class="w-full rounded-sm input-xs input input-bordered border-slate-400 text-slate-100"
                              id="edit-product-cost"
                              value=${row.cost_of_product}
                              required
                            />
                        </div>
                        <div>
                           <input
                              type="text"
                              placeholder="Product quantity"
                              class="w-full rounded-sm input-xs input input-bordered border-slate-400 text-slate-100 mb-3"
                              id="edit-product-initial-qty"
                              value=${row.product_initial_qty}
                              required
                            />
                        </div>
                        
                          <button
                            class="px-3 py-1 text-xs font-medium text-white rounded-sm btn btn-xs btn-accent"
                            id="btn-submit-edit"
                            onclick="submitEditProductData(${id})"
                          >
                            Submit
                          </button>
                        
                      </div>
                        `;

        ipcRenderer.send("load:edit", "product-data", editForm, 300, 450, id);
      });
    });
  });
};

{
  /* <div class="py-3 w-full"></div> */
}

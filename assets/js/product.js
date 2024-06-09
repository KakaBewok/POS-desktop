const db = require("../../config/database/config-db");

function loadProduct() {
  const query = `SELECT * FROM product`;

  db.serialize(() => {
    db.all(query, (err, rows) => {
      if (err) throw err;
      let result = "";

      if (rows.length < 1) {
        result += "";
      } else {
        rows.forEach((row) => {
          result += `
                        <tr data-id=${row.id} class="text-black" >
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
                                    class="px-3 py-1 text-xs font-medium text-white rounded-sm btn btn-xs btn-primary"
                                >
                                    <i class="fa fa-edit"></i>Close
                                </button>
                                <button
                                    class="px-3 py-1 text-xs font-medium text-white rounded-sm btn btn-xs btn-secondary"
                                >
                                    <i class="fa fa-trash"></i>Delete
                                </button>
                            </td>
                        </tr>
            `;
        });
      }
      console.log(result);
      $("tbody#data").html(result);
    });
  });
}

module.exports = loadProduct;

// const loadProduct = require("./product");

let docId = $("body").attr("id");

const loadData = () => {
  switch (docId) {
    case "product-data":
      loadProduct();
      break;
  }
};

loadData();

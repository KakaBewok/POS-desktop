const openFormAddData = () => {
  $("#form-add-data").removeClass("hidden");
  $("#table-separator").removeClass("hidden");
  $("#product-name").focus();
};

const closeFormAddData = () => {
  $("#form-add-data").addClass("hidden");
  $("#table-separator").addClass("hidden");
};

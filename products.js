module.exports = function (options) {
  //adding product
  this.add({ role: "product", cmd: "add" }, (msg, res) => {
    console.log("Recived data: " + msg.data);
    this.make("product").data$(msg.data).save$(res);
  });

  //for getting all product
  this.add({ role: "product", cmd: "get" }, (msg, res) => {
    this.make("product").list$({}, res);
  });

  //for deleting all products
  this.add({ role: "product", cmd: "delete" }, (msg, res) => {
    this.make("product").remove$({}, res);
  });
};

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
    this.make("product").list$({}, (err, list) => {
      if (list.length > 0) {
        for (var i = 1; i < list.length; i++) {
          this.make("product").remove$({}, () => {});
        }
        this.make("product").remove$({}, res);
      } else {
        this.make("product").remove$({}, res);
      }
    });
  });
};

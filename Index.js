var seneca = require("seneca")();

//pattern for GET API
seneca.add("role:get,cmd:products", (args, done) => {
  done(null, { K: "Successg" });
});

//pattern for POST API
seneca.add("role:post,cmd:products", (args, done) => {
  done(null, { K: "Successp" });
});

//adding pattern for DELETE API
seneca.add("role:delete,cmd:products", (args, done) => {
  done(null, { K: "Successd" });
});

// act to redirect api request to matching pattern
seneca.act("role:web", {
  use: {
    prefix: "",
    pin: { role: "get", cmd: "*" },
    map: {
      products: { GET: true },
    },
  },
  use: {
    prefix: "",
    pin: { role: "delete", cmd: "*" },
    map: {
      products: { DELETE: true },
    },
  },
  use: {
    prefix: "",
    pin: { role: "post", cmd: "*" },
    map: {
      products: { POST: true },
    },
  },
});

//configuration of express framework
var express = require("express");
var app = express();

app.use(seneca.export("web"));

app.listen(3009);

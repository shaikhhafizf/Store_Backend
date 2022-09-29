var seneca = require("seneca")();

// Varriable for get,post and delete count
var getCount = 0;
var postCount = 0;
var deleteCount = 0;

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

//middleware to count post and Get request
function countRequest(req, res, next) {
  if (req.method === "GET") getCount++;
  else if (req.method === "POST") postCount++;
  else if (req.method === "DELETE") deleteCount++;

  console.log("Number of GET request " + getCount);
  console.log("Number of POST request " + postCount);
  console.log("Number of DELETE request " + deleteCount);
  if (next) next();
}

//configuration of express framework
var express = require("express");
var app = express();

//added middleware to count request according to it's type
app.use(countRequest);

// to parser request
app.use(require("body-parser").json());

app.use(seneca.export("web"));

app.listen(3009);

var seneca = require("seneca")();

// Varriable for get,post and delete count
var getCount = 0;
var postCount = 0;
var deleteCount = 0;

//adding pattern for GET api
seneca.add("role:get,cmd:products", (args, done) => {
  console.log(args.method);
  done(null, { K: "Successg" });
});
//pattern for Post api
seneca.add("role:post,cmd:products", (args, done) => {
  console.log(args.method);
  done(null, { K: "Successp" });
});
//adding pattern for delete api
seneca.add("role:delete,cmd:products", (args, done) => {
  console.log(args.method);
  done(null, { K: "Successd" });
});

// act for GET request
seneca.act("role:web", {
  use: {
    prefix: "",
    pin: { role: "get", cmd: "*" },
    map: {
      products: { GET: true },
    },
  },
});

// act for POST request
seneca.act("role:web", {
  use: {
    prefix: "",
    pin: { role: "post", cmd: "*" },
    map: {
      products: { POST: true },
    },
  },
});

// act for DELETE request
seneca.act("role:web", {
  use: {
    prefix: "",
    pin: { role: "delete", cmd: "*" },
    map: {
      products: { DELETE: true },
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

// Define listening port
app.listen(3009);

var seneca = require("seneca")();
var product = seneca.use("products");
product.use("seneca-entity");

// --------------------------------------Varriable for get,post and delete count
var getCount = 0;
var postCount = 0;
var deleteCount = 0;

//---------------------------------------adding pattern for GET api
seneca.add("role:get,cmd:products", (args, done) => {
  console.log("> products GET: received request");
  product.act({ role: "product", cmd: "get" }, (err, msg) => {
    console.log("< products GET: sending response");
    done(null, { Products: msg });
  });
});
//----------------------------------------pattern for Post api
seneca.add("role:post,cmd:products", (args, done) => {
  console.log("> products POST: received request");
  product.act(
    {
      role: "product",
      cmd: "add",
      data: {
        productName: args.productName,
        price: args.price,
        category: args.category,
      },
    },
    (err, msg) => {
      console.log("< products POST: sending response");
      done(null, { Products: msg });
    }
  );
});
//---------------------------------------pattern for delete api
seneca.add("role:delete,cmd:products", (args, done) => {
  console.log("> products DELETE: received request");
  product.act({ role: "product", cmd: "delete" }, (err, msg) => {
    console.log("< products DELETE: sending response");
    if (err) done(null, "Occur error while deleting");
    if (!msg) done(null, msg);
  });
});

//--------------------------------------act for GET request
seneca.act("role:web", {
  use: {
    prefix: "",
    pin: { role: "get", cmd: "*" },
    map: {
      products: { GET: true },
    },
  },
});

//-------------------------------------act for POST request
seneca.act("role:web", {
  use: {
    prefix: "",
    pin: { role: "post", cmd: "*" },
    map: {
      products: { POST: true },
    },
  },
});

// -------------------------------------act for DELETE request
seneca.act("role:web", {
  use: {
    prefix: "",
    pin: { role: "delete", cmd: "*" },
    map: {
      products: { DELETE: true },
    },
  },
});

//------------------------------middleware to count post and Get request
function countRequest(req, res, next) {
  if (req.method === "GET") getCount++;
  else if (req.method === "POST") postCount++;
  else if (req.method === "DELETE") deleteCount++;

  console.log(
    "Request Count ---> GET: " +
      getCount +
      ", POST: " +
      postCount +
      ", DELETE: " +
      deleteCount
  );
  if (next) next();
}

//---------------------------------configuration of express framework
var express = require("express");
var app = express();

//-----------------------added middleware to count request according to it's type
app.use(countRequest);

// -------------------------------------to parser request
app.use(require("body-parser").json());

app.use(seneca.export("web"));

// ------------------------------------Define listening port
app.listen(3009);

//--------------------------------------Server Details
console.log("*-------------Instructions----------------------*");
console.log("Server listening at http://127.0.0.1:3009");
console.log("-------------Requests----------------------");
console.log(
  "http://127.0.0.1:3009/products?productName=mapple&price=1.99&category=fruit [POST request to add product]"
);
console.log(
  "http://127.0.0.1:3009/products [GET request to fetch all product]"
);
console.log(
  "http://127.0.0.1:3009/products [DELETE request to delete all product]"
);

var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Wu86z!6FPQ$x",
  database: "bamazonDB"
});

connection.connect(function(err) {
  if (err) throw err;
  taskChoice();
});

function taskChoice() {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "View Product for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
        case "View Product for Sale":
          productsList();
          break;

        case "View Low Inventory":
          lowInventorySearch();
          break;

        case "Add to Inventory":
          addToInventory();
          break;

        case "Add New Product":
          addNewProduct();
          break;
      }
    });
}

function productsList() {
  console.log("product list");
  taskChoice();
}

function lowInventorySearch() {
  console.log("low inventory");
  taskChoice();
}

function addToInventory() {
  console.log("Add to inventory");
  taskChoice();
}

function addNewProduct() {
  console.log("Add new product");
  taskChoice();
}

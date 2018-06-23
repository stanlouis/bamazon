var mysql = require("mysql");
var inquirer = require("inquirer");
require('dotenv').config();

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: process.env.DB_PASS,
  database: "bamazonDB"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  displayAllProducts();
});

function displayAllProducts() {
  connection.query("SELECT item_id, product_name, price FROM products", function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      console.log("Item_id: " + res[i].item_id + " || Product Name: " + res[i].product_name + " || Price: " + res[i].price);
    }
    purchase();
  });
}

function validateEntry(value) {
  if (isNaN(value) === false) {
    return true;
  }
  return "Please enter a valid Number";
}

function purchase() {
  inquirer
    .prompt([{
        name: "item",
        type: "input",
        message: "What is The item_id you would like to purchase?",
        validate: validateEntry
      },
      {
        name: "quantity",
        type: "input",
        message: "How many units of the product would would like to buy?",
        validate: validateEntry
      }
    ]).then(function (input) {
      var item = input.item;
      var quantity = input.quantity;
      console.log('item:', item, 'quantity:', quantity)
    })
}
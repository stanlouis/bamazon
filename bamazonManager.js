const mysql = require('mysql');
const inquirer = require('inquirer');
require("dotenv").config();

const connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: 'root',

  // Your password
  password: process.env.DB_PASS,
  database: 'bamazonDB',
});

connection.connect(err => {
  if (err) throw err;
  taskChoice();
});

function taskChoice() {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do? (Ctrl-C to quit)",
      choices: [
        "View Product for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product"
      ]
    })
    .then(answer => {
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
  connection.query("SELECT * FROM products", (err, res) => {
    if (err) throw err;
    console.log("---Our list of products---");

    for (var i = 0; i < res.length; i++) {
      console.log(
        `Item_id: ${res[i].item_id} || Product Name: ${res[i].product_name} || Price: ${res[i].price} || Stock Quantity: ${res[i].stock_quantity}`
      );
    }
    console.log("***********************************************************");
    taskChoice();
  });
}

function lowInventorySearch() {
  var lowInventoryQuery =
    "SELECT item_id, product_name, stock_quantity FROM products" +
    " WHERE" +
    " stock_quantity < 5";
  connection.query(lowInventoryQuery, function(err, res) {
    if (err) throw err;
    console.log("---Our low inventory list---");

    for (var i = 0; i < res.length; i++) {
      console.log(
        `Item_id: ${res[i].item_id} || Product Name: ${res[i].product_name} || Stock Quantity: ${res[i].stock_quantity}`
      );
    }
    console.log("***********************************************************");
    taskChoice();
  });
  taskChoice();
}

function validateEntry(value) {
  if (isNaN(value) === false) {
    return true;
  }
  return "Please enter a valid Number";
}

function addToInventory() {
  inquirer
    .prompt([
      {
        name: "item_id",
        type: "input",
        message: "Enter the item_id of product to update.",
        validate: validateEntry
      },
      {
        name: "quantity",
        type: "input",
        message: "How many units of the product would would like to add?",
        validate: validateEntry
      }
    ])
    .then(input => {
      var item = input.item_id;
      var quantityToAdd = parseInt(input.quantity);
      console.log("quantityToAdd", quantityToAdd);

      var query = "SELECT stock_quantity FROM products WHERE?";

      connection.query(query, { item_id: item }, (err, res) => {
        if (err) throw err;
        var itemId = res[0].item_id;
        var quantityRemaining = res[0].stock_quantity;

        if (res.length === 0) {
          console.log(`Sorry, we do not carry item with item_id ${item}`);
          taskChoice();
        } else {
          quantityRemaining += quantityToAdd;

          connection.query(
            "UPDATE products SET ? WHERE ?",
            [
              {
                stock_quantity: quantityRemaining
              },
              {
                item_id: item
              }
            ],
              error => {
                if (error) throw err;
                console.log("Quantity successfully updated!");
                taskChoice();
              }
          );
        }
      });
    });
}

function addNewProduct() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "product_name",
        message: "Enter the product name."
      },
      {
        type: "input",
        name: "department_name",
        message: "Enter the product department name"
      },
      {
        type: "input",
        name: "price",
        message: "Enter the product price",
        validate: validateEntry
      },
      {
        type: "input",
        name: "stock_quantity",
        message: "Enter the quantity of the product",
        validate: validateEntry
      }
    ])
    .then(input => {
      connection.query(
        "INSERT INTO products SET ?",
        {
          product_name: input.product_name,
          department_name: input.department_name,
          price: input.price,
          stock_quantity: input.stock_quantity
        },
          (err, res) => {
          console.log(`${res.affectedRows}products updated!
`);
          taskChoice();
        }
      );
    });
}

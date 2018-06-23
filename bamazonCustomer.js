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
    console.log('---Our list of products---');

    for (var i = 0; i < res.length; i++) {
      console.log("Item_id: " + res[i].item_id + " || Product Name: " + res[i].product_name + " || Price: " + res[i].price);
    }
    console.log('\n');
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
      // console.log('item:', item, 'quantity:', quantity)
      var query = 'SELECT item_id, stock_quantity, price FROM products WHERE ?';

      connection.query(query, {
          item_id: item
        },
        function (err, res) {
          var itemId = res[0].item_id;
          var quantityRemaining = res[0].stock_quantity;
          var price = res[0].price;
          // console.log(res, itemId, quantityRemaining)
          if (res.length === 0) {
            console.log(`Sorry, we do not carry item with item_id ${item}`);
            displayAllProducts();
          } else if (quantityRemaining < quantity) {
            console.log(`Insufficient quantity!, ${quantityRemaining} left`);
            displayAllProducts();
          } else {
            var cost = quantity * price;
            quantityRemaining -= quantity;
            console.log(`Thanks for your purchase. Your total cost is $${cost}`);
            connection.query(
              "UPDATE products SET ? WHERE ?", [{
                  stock_quantity: quantityRemaining
                },
                {
                  item_id: itemId
                }
              ],
              function (error) {
                if (error) throw err;
                console.log("Quantity successfully updated!");
                displayAllProducts();
              }
            );
          }
        })
    })
}
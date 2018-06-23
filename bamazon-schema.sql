DROP DATABASE IF EXISTS bamazonDB;
CREATE database bamazonDB;

USE bamazonDB;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price DECIMAL(10,4) NULL,
  stock_quantity INT NOT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO `products` 
            (`product_name`, 
             `department_name`, 
             `price`, 
             `stock_quantity`) 
VALUES      ("The Road Less Traveled", 
             "books", 
             "4.18", 
             6), 
            ("Kindle Fire", 
             "electronics", 
             "140.90", 
             7), 
            ("Ipad", 
             "electronics", 
             "610.84", 
             1), 
            ("Silver Jeans Co. Men's Zac Relaxed Fit", 
             "clothing", 
             "47.57", 
             4), 
            ("Bose QuietComfort 35", 
             "electronics", 
             "328.29", 
             3), 
            ("Folgers Classic Roast", 
             "grocery", 
             "8.36", 
             5), 
            ("The President Is Missing", 
             "books", 
             "14.51", 
             70), 
            ("Keurig K-Elite", 
             "kitchen", 
             "49.31", 
             10), 
            ("iRobot Roomba 870", 
             "industrial & scientific", 
             "54.85", 
             10), 
            ("Marino’s Men Belt", 
             "clothing", 
             "13.13", 
             5);



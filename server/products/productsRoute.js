const db = require("../../db/index.js");
const express = require("express");
const productsRoute = express.Router();

// add :productID and the found product to the request body if it exists, otherwise 404
productsRoute.param("productId", (req, res, next, productId) => {
  db.query(
    "SELECT * FROM products WHERE id = $1;",
    [productId],
    (err, result) => {
      if (err || result.rows.length === 0) {
        res.status(404).send("Product could not be found");
      } else {
        req.productId = productId;
        req.chosenProduct = result.rows[0];
        next();
      }
    }
  );
});
// GET /api/products to return all products
productsRoute.get("/", (req, res, next) => {
  db.query("SELECT * FROM products;", [], (err, result) => {
    if (err) {
      res.status(400).send("something went wrong");
    }
    res.status(200).send(result.rows);
  });
});
// GET /api/products/:productId to return a single prodcut by ID
productsRoute.get("/:productId", (req, res, next) => {
  res.status(200).send(req.chosenProduct);
});
// POST /api/products to add new product to the table
productsRoute.post("/", (req, res, next) => {
  newProduct = req.body;
  if (isValidProduct(newProduct)) {
    db.query(
      "INSERT INTO products (name, price, stock) VALUES ($1, $2, $3);",
      [newProduct.name, newProduct.price, newProduct.stock],
      (err, result) => {
        if (err) {
          res.status(400).send("something went wrong");
        }
        res.status(201).send();
      }
    );
  }
});
// PUT /api/products/:productId to update an existing product by ID
productsRoute.put("/:productId", (req, res, next) => {
  newProduct = req.body;
  if (isValidProduct(newProduct)) {
    db.query(
      "UPDATE products SET name = $1, price = $2, stock = $3 WHERE id = $4",
      [newProduct.name, newProduct.price, newProduct.stock, req.productId],
      (err, result) => {
        if (err) {
          res.status(400).send("something went wrong");
        }
        res.send("update success");
      }
    );
  } else {
    res.status(400).send("please send a valid product");
  }
});
// DELETE /api/products/:productId to delete a product by ID
productsRoute.delete("/:productId", (req, res, next) => {
  db.query(
    "DELETE FROM products WHERE id = $1",
    [req.productId],
    (err, result) => {
      if (err) {
        res.status(400).send("something went wrong");
      }
      res.status(204).send("product removed");
    }
  );
});
// Utility Functions
function isValidProduct(instance) {
  instance.name = instance.name || "";
  instance.price = instance.price || 19.99;
  instance.stock = instance.stock || 0;
  if (
    typeof instance.name !== "string" ||
    typeof instance.price !== "number" ||
    typeof instance.stock !== "number"
  ) {
    return false;
  }
  return true;
}
module.exports = productsRoute;

const db = require("../../db/index.js");
const express = require("express");
const cartsRoute = express.Router();

// add :userId and the users cart to the reqest body if it exists, otherwise 404
cartsRoute.param("userId", (req, res, next, userId) => {
  db.query(
    "SELECT * FROM carts WHERE user_id = $1;",
    [userId],
    (err, result) => {
      if (err || result.rows.length === 0) {
        res.status(404).send("Cart could not be found");
      } else {
        req.userId = userId;
        req.chosenUserCart = result.rows[0];
        next();
      }
    }
  );
});

// GET /api/carts return all carts
cartsRoute.get("/", (req, res, next) => {
  db.query("SELECT * FROM carts", [], (err, result) => {
    if (err) {
      res.status(400).send("something went wrong");
    } else {
      res.status(200).send(result.rows);
    }
  });
});

// POST /api/carts create a new cart
cartsRoute.post("/", (req, res, next) => {
  db.query(
    "INSERT INTO carts (user_id, created) VALUES ($1 , NOW())",
    [req.body.userId],
    (err, result) => {
      if (err) {
        res.status(400).send("something went wrong");
      } else {
        res.status(201).send("cart created");
      }
    }
  );
});

// GET /api/carts/:userId return a specific cart by userID
cartsRoute.get("/:userId", (req, res, next) => {
  res.send(req.chosenUserCart);
});

// DELETE /api/carts/:userId delete a specific cart by userID
cartsRoute.delete("/:userId", (req, res, next) => {
  db.query(
    "DELETE FROM carts WHERE user_id = $1",
    [req.userId],
    (err, result) => {
      if (err) {
        res.status(400).send("something went wrong");
      } else {
        res.status(204).send("Delete Success");
      }
    }
  );
});
// view all items in a users cart
cartsRoute.get("/:userId/items", (req, res, next) => {
  db.query(
    "SELECT * FROM carts_items WHERE cart_id = $1",
    [req.chosenUserCart.id],
    (err, result) => {
      if (err) {
        res.status(400).send("something went wrong");
      } else {
        res.send(result.rows);
      }
    }
  );
});

// Add product to cart
cartsRoute.post("/:userId/items", (req, res, next) => {
  db.query(
    "INSERT INTO carts_items (cart_id, product_id, quantity) VALUES ($1, $2, $3);",
    [req.chosenUserCart.id, req.body.productId, req.body.quantity],
    (err, result) => {
      if (err) {
        res.status(400).send("something went wrong");
      } else {
        res.status(201).send("Product added to cart");
      }
    }
  );
});
// Remove product from cart
cartsRoute.delete("/:userId/items", (req, res, next) => {
  db.query(
    "DELETE FROM carts_items WHERE cart_id = $1 AND product_id = $2;",
    [req.chosenUserCart.id, req.body.productId],
    (err, result) => {
      if (err) {
        res.status(400).send("something went wrong");
      } else {
        res.status(204).send("Product removed from cart");
      }
    }
  );
});

// Update product quatity in cart
cartsRoute.put("/:userId/items", (req, res, next) => {
  db.query(
    "UPDATE carts_items SET quantity = $1 WHERE cart_id = $2 AND product_id = $3",
    [req.body.quantity, req.chosenUserCart.id, req.body.productId],
    (err, result) => {
      if (err) {
        res.status(400).send("something went wrong");
      } else {
        res.send("update succuss");
      }
    }
  );
});
//Utility Functions

module.exports = cartsRoute;

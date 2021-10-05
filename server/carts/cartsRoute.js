const db = require("../../db/index.js");
const express = require("express-promise-router");
const cartsRoute = new express();

/**
 * @swagger
 * definitions:
 *   carts:
 *     properties:
 *       id:
 *         type: integer
 *       user_id:
 *         type: integer
 *       created:
 *         type: date
 *   carts_items:
 *     properties:
 *       cart_id:
 *         type: integer
 *       product_id:
 *         type: integer
 *       quantity:
 *         type: integer
 */

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
/**
 * @swagger
 * /api/carts:
 *   get:
 *     description: Returns all carts
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of carts
 *         schema:
 *           $ref: '#/definitions/carts'
 */
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
/**
 * @swagger
 * /api/carts:
 *   post:
 *     description: create a new cart
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userId
 *         description: userId parameter in an object
 *         in: body
 *         required: true
 *         type: object
 *         properties:
 *           userId:
 *             type: integer
 *     responses:
 *       201:
 *         description: new cart created
 */
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
/**
 * @swagger
 * /api/carts/{userId}:
 *   get:
 *     description: Returns a single product
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userId
 *         description: user's id number
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: a single cart object
 *         schema:
 *           $ref: '#/definitions/carts'
 */
cartsRoute.get("/:userId", (req, res, next) => {
  res.send(req.chosenUserCart);
});

// DELETE /api/carts/:userId delete a specific cart by userID
/**
 * @swagger
 * /api/carts/{userId}:
 *   delete:
 *     description: delete a single cart
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userId
 *         description: user's id number
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       204:
 *         description: cart removed
 */
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
/**
 * @swagger
 * /api/carts/{userId}/items:
 *   get:
 *     description: Returns all items in a user's cart
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userId
 *         description: user's id number
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: an array of carts_items objects
 *         schema:
 *           $ref: '#/definitions/carts_items'
 */
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
/**
 * @swagger
 * /api/carts/{userId}/items:
 *   post:
 *     description: Add an item to a user's cart
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userId
 *         description: user's id number
 *         in: path
 *         required: true
 *         type: integer
 *       - name: carts_items
 *         description: carts_items object
 *         in: body
 *         type: object
 *         schema:
 *           $ref: '#/definitions/carts_items'
 *     responses:
 *       201:
 *         description: product added to cart
 */
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
/**
 * @swagger
 * /api/carts/{userId}/items:
 *   delete:
 *     description: delete a product from a cart
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userId
 *         description: user's id number
 *         in: path
 *         required: true
 *         type: integer
 *       - name: productId
 *         description: productId object
 *         in: body
 *         type: object
 *         properties:
 *           productId:
 *             type: integer
 *     responses:
 *       204:
 *         description: cart removed
 */
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
/**
 * @swagger
 * /api/carts/{userId}/items:
 *   put:
 *     description: update the quantity of a product in a users cart
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userId
 *         description: user's id number
 *         in: path
 *         required: true
 *         type: integer
 *       - name: carts_items
 *         description: carts_items object
 *         in: body
 *         type: object
 *         properties:
 *           productId:
 *             type: integer
 *           quantity:
 *             type: integer
 *     responses:
 *       200:
 *         description: quantity updated
 */
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

// POST /api/cart/:userId/checkout checkout the cart and create an order.
/**
 * @swagger
 * /api/carts/{userId}/checkout:
 *   post:
 *     description: checkout the cart and create an order
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userId
 *         description: user's id number
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: order now placed
 */
cartsRoute.post("/:userId/checkout", async (req, res, next) => {
  const validCart = await isValidCart(req.chosenUserCart.id);
  const validPayment = isValidPayment();

  if (validCart) {
    if (validPayment) {
      // create order with status "processing"
      let newOrder = await db.asyncQuery(
        "INSERT INTO orders (user_id, status, created) VALUES ($1, $2, NOW()) RETURNING *;",
        [req.userId, "processing"]
      );
      // add items from carts_items to orders_items
      let { rows } = await db.asyncQuery(
        "SELECT * FROM carts_items WHERE cart_id = $1",
        [req.chosenUserCart.id]
      );
      let cartPrice = await calculateCartPrice(req.chosenUserCart.id);
      for (let i = 0; i < rows.length; i++) {
        await db.asyncQuery(
          "INSERT INTO orders_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)",
          [newOrder.rows[0].id, rows[i].product_id, rows[i].quantity, cartPrice]
        );
        await db.asyncQuery(
          "DELETE FROM carts_items WHERE cart_id = $1 AND product_id = $2",
          [req.chosenUserCart.id, rows[i].product_id]
        );
      }
      // delete cart
      await db.asyncQuery("DELETE FROM carts WHERE id = $1", [
        req.chosenUserCart.id,
      ]);
      // update order with status "placed"
      await db.asyncQuery("UPDATE orders SET status = $1 WHERE id = $2", [
        "placed",
        newOrder.rows[0].id,
      ]);
      res.send("order now placed");
    } else {
      res.status(400).send("payment invalid");
    }
  } else {
    res.status(400).send("Cart is invalid");
  }
});

//Utility Functions
/*
 * isValidCart checks to see if the provided cart object conatains enough stock to meet the order
 * @param {integer}   cartId    the ID number of the cart you are trying to check
 * @return {bool}               returns true if the cart object contains the valid types
 */
async function isValidCart(cartId) {
  const { rows } = await db.asyncQuery(
    "SELECT * FROM carts_items WHERE cart_id = $1",
    [cartId]
  );
  let validCart = true;
  let i = 0;
  while (validCart && i < rows.length) {
    let product = await db.asyncQuery("SELECT * FROM products WHERE id = $1;", [
      rows[i].product_id,
    ]);
    if (rows[i].quantity > product.rows[0].stock) {
      validCart = false;
    }
    i++;
  }
  return validCart;
}

/*
 * isValidPayment checks to see if the provided product object conatains the valid types or sets defaults
 * @param {none}                 Currently none
 * @return {bool}                returns true if the payment method is valid
 */
function isValidPayment() {
  return true;
}

/*
 * calculateCartPrice takes a cartId and sums the price of all products in the cart
 * @param {integer}   cartId      the product object you are looking to check
 * @return {number}               returns monetary value of the cart in question
 */
async function calculateCartPrice(cartId) {
  const { rows } = await db.asyncQuery(
    "SELECT * FROM carts_items WHERE cart_id = $1",
    [cartId]
  );
  let runningTotal = 0.0;
  for (let i = 0; i < rows.length; i++) {
    let eachProduct = await db.asyncQuery(
      "SELECT price FROM products WHERE id = $1",
      [rows[i].product_id]
    );
    runningTotal =
      runningTotal +
      Number(
        eachProduct.rows[0].price.substring(1, eachProduct.rows[0].price.length)
      ) *
        rows[i].quantity;
  }
  return runningTotal;
}

module.exports = cartsRoute;

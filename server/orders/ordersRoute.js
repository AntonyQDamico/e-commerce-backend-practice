const db = require("../../db/index.js");
const express = require("express");
const ordersRoute = express.Router();

/**
 * @swagger
 * definitions:
 *   orders:
 *     properties:
 *       id:
 *         type: integer
 *       user_id:
 *         type: integer
 *       status:
 *         type: string
 *       created:
 *         type: date
 *   orders_items:
 *     properties:
 *       order_id:
 *         type: integer
 *       product_id:
 *         type: integer
 *       quantity:
 *         type: integer
 *       price:
 *         type: number
 */

// Add :orderId and the order to the request body if it exists, otherwise 404
ordersRoute.param("orderId", (req, res, next, orderId) => {
  db.query("SELECT * FROM orders WHERE id = $1;", [orderId], (err, result) => {
    if (err || result.rows.length === 0) {
      res.status(404).send("Order could not be found");
    } else {
      req.orderId = orderId;
      req.chosenOrder = result.rows[0];
      next();
    }
  });
});

// GET /api/orders return all orders
/**
 * @swagger
 * /api/orders:
 *   get:
 *     description: Returns all orders
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of orders
 *         schema:
 *           $ref: '#/definitions/orders'
 */
ordersRoute.get("/", (req, res, next) => {
  db.query("SELECT * FROM orders", [], (err, result) => {
    if (err) {
      res.status(400).send("something went wrong");
    } else {
      res.send(result.rows);
    }
  });
});

// POST /api/orders create an order
/**
 * @swagger
 * /api/orders:
 *   post:
 *     description: create a new order
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: order
 *         description: order object
 *         in: body
 *         required: true
 *         type: object
 *         properties:
 *           userId:
 *             type: integer
 *           status:
 *             type: string
 *     responses:
 *       201:
 *         description: new order created
 */
ordersRoute.post("/", (req, res, next) => {
  db.query(
    "INSERT INTO orders (user_id, status, created) VALUES ($1, $2, NOW())",
    [req.body.userId, req.body.status],
    (err, result) => {
      if (err) {
        res.status(400).send("something went wrong");
      } else {
        res.status(201).send("order created");
      }
    }
  );
});

// PUT /api/orders/:orderId edit an existing order
/**
 * @swagger
 * /api/orders/{orderId}:
 *   put:
 *     description: update an order's information
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: orderId
 *         description: order's id number
 *         in: path
 *         required: true
 *         type: integer
 *       - name: order
 *         description: order object
 *         in: body
 *         type: object
 *         properties:
 *           status:
 *             type: string
 *     responses:
 *       200:
 *         description: order updated
 */
ordersRoute.put("/:orderId", (req, res, next) => {
  db.query(
    "UPDATE orders SET status = $1 WHERE id = $2",
    [req.body.status, req.orderId],
    (err, result) => {
      if (err) {
        res.status(400).send("something went wrong");
      } else {
        res.status(200).send("update success");
      }
    }
  );
});

// DELETE /api/orders/:orderId delete an existing order
/**
 * @swagger
 * /api/orders/{orderId}:
 *   delete:
 *     description: delete a single order
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: orderId
 *         description: order's id number
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       204:
 *         description: order removed
 */
ordersRoute.delete("/:orderId", (req, res, next) => {
  db.query("DELETE FROM orders WHERE id = $1", [req.orderId], (err, result) => {
    if (err) {
      res.status(400).send("something went wrong");
    } else {
      res.status(204).send("Delete Success");
    }
  });
});

// GET /api/orders/:orderId/items see all products within an order
/**
 * @swagger
 * /api/orders/{orderId}/items:
 *   get:
 *     description: Returns all products within an orders
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: orderId
 *         description: order's id number
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: An array of orders_items objects
 *         schema:
 *           $ref: '#/definitions/orders_items'
 */
ordersRoute.get("/:orderId/items", (req, res, next) => {
  db.query(
    "SELECT * FROM orders_items WHERE order_id = $1",
    [req.orderId],
    (err, result) => {
      if (err) {
        res.status(400).send("something went wrong");
      } else {
        res.status(200).send(result.rows);
      }
    }
  );
});

// POST /api/orders/:orderId/items add a product to an order
/**
 * @swagger
 * /api/orders/{orderId}/items:
 *   post:
 *     description: add a product to an order
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: orderId
 *         description: order's id number
 *         in: path
 *         required: true
 *         type: integer
 *       - name: order_items
 *         description: orders_items object
 *         in: body
 *         required: true
 *         type: object
 *         properties:
 *           productId:
 *             type: integer
 *           quantity:
 *             type: integer
 *           price:
 *             type: number
 *     responses:
 *       201:
 *         description: new product added
 */
ordersRoute.post("/:orderId/items", (req, res, next) => {
  db.query(
    "INSERT INTO orders_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)",
    [req.orderId, req.body.productId, req.body.quantity, req.body.price],
    (err, result) => {
      if (err) {
        res.status(400).send("something went wrong");
      } else {
        res.status(201).send("Product Added");
      }
    }
  );
});

// PUT /api/orders/:orderId/items edit values of a product in an existing order
/**
 * @swagger
 * /api/orders/{orderId}/items:
 *   put:
 *     description: update values of a product in an existing order
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: orderId
 *         description: order's id number
 *         in: path
 *         required: true
 *         type: integer
 *       - name: order_items
 *         description: orders_items object
 *         in: body
 *         required: true
 *         type: object
 *         properties:
 *           productId:
 *             type: integer
 *           quantity:
 *             type: integer
 *           price:
 *             type: number
 *     responses:
 *       200:
 *         description: order updated
 */
ordersRoute.put("/:orderId/items", (req, res, next) => {
  db.query(
    "UPDATE orders_items SET quantity = $1, price = $2 WHERE order_id = $3 AND product_id = $4",
    [req.body.quantity, req.body.price, req.orderId, req.body.productId],
    (err, result) => {
      if (err) {
        res.status(400).send("something went wrong");
      } else {
        res.status(200).send("Update Success");
      }
    }
  );
});

// DELETE /api/orders/:orderId/items remove a product from an order
/**
 * @swagger
 * /api/orders/{orderId}/items:
 *   delete:
 *     description: remove a product from an order
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: orderId
 *         description: order's id number
 *         in: path
 *         required: true
 *         type: integer
 *       - name: order_items
 *         description: orders_items object
 *         in: body
 *         required: true
 *         type: object
 *         properties:
 *           productId:
 *             type: integer
 *     responses:
 *       204:
 *         description: product removed from order
 */
ordersRoute.delete("/:orderId/items", (req, res, next) => {
  db.query(
    "DELETE FROM orders_items WHERE order_id = $1 AND product_id = $2;",
    [req.orderId, req.body.productId],
    (err, result) => {
      if (err) {
        res.status(400).send("something went wrong");
      } else {
        res.status(204).send("Delete Success");
      }
    }
  );
});

module.exports = ordersRoute;

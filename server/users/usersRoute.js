const db = require("../../db/index.js");
const express = require("express");
const usersRoute = express.Router();

/**
 * @swagger
 * definitions:
 *   users:
 *     properties:
 *       id:
 *         type: integer
 *       email:
 *         type: string
 *       password:
 *         type: string
 *       first_name:
 *         type: string
 *       last_name:
 *         type: string
 */

// add :userId and the returned user to the request body if it exists, otherwise 404
usersRoute.param("userId", (req, res, next, userId) => {
  db.query("SELECT * FROM users WHERE id = $1;", [userId], (err, result) => {
    if (err || result.rows.length === 0) {
      res.status(404).send("User could not be found");
    } else {
      req.userId = userId;
      req.chosenUser = result.rows[0];
      next();
    }
  });
});

// GET /api/users return all users
/**
 * @swagger
 * /api/users:
 *   get:
 *     description: Returns all users
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of users
 *         schema:
 *           $ref: '#/definitions/users'
 */
usersRoute.get("/", (req, res, next) => {
  db.query("SELECT * FROM users", [], (err, result) => {
    if (err) {
      res.status(400).send("something went wrong");
    } else {
      res.status(200).send(result.rows);
    }
  });
});

// GET /api/users/:userId return a single user by ID
/**
 * @swagger
 * /api/users/{userId}:
 *   get:
 *     description: Returns a single user
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
 *         description: a single user object
 *         schema:
 *           $ref: '#/definitions/users'
 */
usersRoute.get("/:userId", (req, res, next) => {
  res.status(200).send(req.chosenUser);
});

// PUT /api/users/:userId edit a single user by ID
/**
 * @swagger
 * /api/users/{userId}:
 *   put:
 *     description: update a users's information
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userId
 *         description: user's id number
 *         in: path
 *         required: true
 *         type: integer
 *       - name: user
 *         description: user object
 *         in: body
 *         type: object
 *         schema:
 *           $ref: '#/definitions/users'
 *     responses:
 *       200:
 *         description: user updated
 */
usersRoute.put("/:userId", (req, res, next) => {
  let newUser = req.body;
  if (isValidUser(newUser)) {
    db.query(
      "UPDATE users SET first_name = $1, last_name = $2, email = $3, password = $4 WHERE id = $5;",
      [
        newUser.firstName,
        newUser.lastName,
        newUser.email,
        newUser.password,
        req.userId,
      ],
      (err, result) => {
        if (err) {
          res.status(400).send("seomthing went wrong");
        } else {
          res.send("update success");
        }
      }
    );
  }
});

// DELETE /api/users/:userId delete a single user by ID
/**
 * @swagger
 * /api/users/{userId}:
 *   delete:
 *     description: delete a single user
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
 *         description: user removed
 */
usersRoute.delete("/:userId", (req, res, next) => {
  db.query("DELETE FROM users WHERE id = $1", [req.userId], (err, result) => {
    if (err) {
      res.status(400).send("seomthing went wrong");
    } else {
      res.status(204).send("delete success");
    }
  });
});

// Utility Functions

/*
 * isValidUser checks to see if the user object provided has the proper parameters and types
 * @param {object}   instance    the user object you are looking to check
 * @return {bool}                returns true if the product object contains the valid types
 */
function isValidUser(instance) {
  instance.firstName = instance.firstName || "";
  instance.lastName = instance.lastName || "";
  instance.email = instance.email || "";
  instance.password = instance.password || "";
  if (
    typeof instance.firstName !== "string" ||
    typeof instance.lastName !== "string" ||
    typeof instance.email !== "string" ||
    typeof instance.password !== "string"
  ) {
    return false;
  }
  return true;
}

module.exports = usersRoute;

const database = require("../../db/SQLFunct.js");
const express = require("express");
const registerRoute = express.Router();

// POST /api/register/ to create new user
/**
 * @swagger
 * /api/register:
 *   post:
 *     description: create a new user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: user object
 *         in: body
 *         required: true
 *         type: object
 *         properties:
 *           email:
 *             type: string
 *           password:
 *             type: string
 *           first_name:
 *             type: string
 *           last_name:
 *             type: string
 *     responses:
 *       201:
 *         description: new user created
 */
registerRoute.post("/", (req, res, next) => {
  let newUser = req.body;
  console.log(1);
  console.log(req.body);
  newUser = database.registerUser(newUser);
  if (newUser) {
    res.status(201).send(newUser);
  } else {
    res.status(400).send();
  }
});

module.exports = registerRoute;

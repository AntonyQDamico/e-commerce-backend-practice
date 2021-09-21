const database = require("../../db/SQLFunct.js");
const express = require("express");
const registerRoute = express.Router();

// POST /api/register/ to create new user
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

const db = require("../../db/index.js");
const express = require("express");
const usersRoute = express.Router();

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
usersRoute.get("/:userId", (req, res, next) => {
  res.status(200).send(req.chosenUser);
});

// PUT /api/users/:userId edit a single user by ID
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

const db = require("../../db/index.js");
const Router = require("express-promise-router");
const loginRoute = new Router();

var passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy;

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new LocalStrategy(async (username, password, done) => {
    db.query(
      `SELECT * FROM users WHERE email = '${username}';`,
      [],
      (err, result) => {
        if (err) {
          throw new Error("Something went wrong with the request");
        }
        if (result.rows[0].password !== password) {
          throw new Error("username or password incorrect");
        }
        done(null, result.rows[0].id);
      }
    );
  })
);

loginRoute.post("/", passport.authenticate("local"), (req, res, next) => {
  console.log("got to login Route Body");
  console.log(req.user);
  res.send("login success");
});

module.exports = loginRoute;

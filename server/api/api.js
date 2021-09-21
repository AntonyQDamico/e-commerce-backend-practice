const express = require("express");
const apiRouter = express.Router();
const registerRouter = require("../register/registerRoute.js");

apiRouter.use("/register", registerRouter);

module.exports = apiRouter;

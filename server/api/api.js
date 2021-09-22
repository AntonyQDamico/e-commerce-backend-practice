const express = require("express");
const apiRouter = express.Router();
const registerRouter = require("../register/registerRoute.js");
const loginRouter = require("../login/loginRoute.js");

apiRouter.use("/register", registerRouter);
apiRouter.use("/login", loginRouter);

module.exports = apiRouter;

const express = require("express");
const apiRouter = express.Router();
const registerRouter = require("../register/registerRoute.js");
const loginRouter = require("../login/loginRoute.js");
const productsRouter = require("../products/productsRoute.js");
const usersRouter = require("../users/usersRoute.js");

apiRouter.use("/register", registerRouter);
apiRouter.use("/login", loginRouter);
apiRouter.use("/products", productsRouter);
apiRouter.use("/users", usersRouter);

module.exports = apiRouter;

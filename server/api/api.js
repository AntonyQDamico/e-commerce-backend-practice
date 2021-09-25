const express = require("express");
const apiRouter = express.Router();
const registerRouter = require("../register/registerRoute.js");
const loginRouter = require("../login/loginRoute.js");
const productsRouter = require("../products/productsRoute.js");

apiRouter.use("/register", registerRouter);
apiRouter.use("/login", loginRouter);
apiRouter.use("/products", productsRouter);

module.exports = apiRouter;

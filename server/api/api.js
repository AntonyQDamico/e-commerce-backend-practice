const express = require("express");
const apiRouter = express.Router();
const registerRouter = require("../register/registerRoute.js");
const loginRouter = require("../login/loginRoute.js");
const productsRouter = require("../products/productsRoute.js");
const usersRouter = require("../users/usersRoute.js");
const cartsRouter = require("../carts/cartsRoute.js");

apiRouter.use("/register", registerRouter);
apiRouter.use("/login", loginRouter);
apiRouter.use("/products", productsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/carts", cartsRouter);

module.exports = apiRouter;

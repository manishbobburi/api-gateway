const express = require("express");
const router = express.Router();

const { AuthMiddlewares } = require("../../middlewares");
const  { UserController  } = require("../../controllers")

router.post("/signup",
    AuthMiddlewares.validateAuthRequest,
    UserController.signup
);

router.post("/signin",
    AuthMiddlewares.validateAuthRequest,
    UserController.signin
);

module.exports = router;
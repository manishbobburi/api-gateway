const express = require('express');
const router = express.Router();

const userRouter = require("./user-routes");

router.use("/signup", userRouter);


module.exports = router;
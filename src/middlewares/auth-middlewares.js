const { StatusCodes } = require("http-status-codes");
const { AppError } = require("../utils/errors");
const { ErrorResponse } = require("../utils/common");

function validateAuthRequest(req, res, next) {
    if(!req.body.email) {
        ErrorResponse.message = "Something went wrong while authenticating user.";
        ErrorResponse.error = new AppError(["Email is required."]);
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse);
    }

    if(!req.body.password) {
        ErrorResponse.message = "Something went wrong while authenticating user.";
        ErrorResponse.error = new AppError(["Password is required."]);
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse);
    }

    next();
}

module.exports = {
    validateAuthRequest,
}
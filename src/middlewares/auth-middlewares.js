const { StatusCodes } = require("http-status-codes");

const { AppError } = require("../utils/errors");
const { ErrorResponse } = require("../utils/common");
const { UserService } = require("../services");

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

async function checkAuth(req, res, next) {
    try {
        const response = await UserService.isAuthenticated(req.headers["x-access-token"]);
        if(response) {
            req.user = response;
            next();
        }       
    } catch (error) {
        throw error;
    }
}

async function isAdmin(req, res, next) {
    try {
        const response = await UserService.isAdmin(req.user);
        if(!response) {
            throw new AppError("Unauthorised access.", StatusCodes.UNAUTHORIZED);
        }
        next();
    } catch (error) {
        throw error;
    }
}

module.exports = {
    validateAuthRequest,
    checkAuth,
    isAdmin,
}
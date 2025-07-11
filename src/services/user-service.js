const { StatusCodes } = require("http-status-codes");

const { UserRepository } = require("../repositories");
const { AppError } = require("../utils/errors");
const { Auth } = require("../utils/common");

const userRepository = new UserRepository();

async function signup(data) {
    try {
        const user = await userRepository.create(data);
        return user;
    } catch (error) {
        if(error.name == "SequelizeValidationError") {
            let explanation = [];
            error.errors.forEach((err) => {
                explanation.push(err.message);
            });
            throw new AppError(explanation, StatusCodes.BAD_REQUEST);
        }
        throw new AppError("Failed to create a new user object", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function signin(data) {
    try {
        const user = await userRepository.getUserByEmail(data.email);
        if(!user) {
            throw new AppError("User not found for the given email.", StatusCodes.NOT_FOUND)
        }

        const passwordMatch = Auth.checkPassword(data.password, user.password);
        if(!passwordMatch) {
            throw new AppError("Invalid password.", StatusCodes.UNAUTHORIZED);
        }

        const jwt = Auth.createToken({id: user.id, email: user.email});      
        return jwt;
    } catch(error) {

        if(error instanceof AppError) throw error;
        throw new AppError("Something went wrong", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    signup,
    signin,
}
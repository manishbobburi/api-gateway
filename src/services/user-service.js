const { StatusCodes } = require("http-status-codes");

const { UserRepository, RoleRepository } = require("../repositories");
const { AppError } = require("../utils/errors");
const { Auth, Enums } = require("../utils/common");
const { compareSync } = require("bcrypt");

const userRepository = new UserRepository();
const roleRepository = new RoleRepository();

async function signup(data) {
    try {
        const user = await userRepository.create(data);
        const role = await roleRepository.getRoleByname(Enums.USER_ROLES.CUSTOMER);
        user.addRole(role);
        return user;
    } catch (error) {
        if(error.name == "SequelizeValidationError") {
            let explanation = [];
            error.errors.forEach((err) => {
                explanation.push(err.message);
            });
            throw new AppError(explanation, StatusCodes.BAD_REQUEST);
        }
        throw new AppError("Failed to create a new user object.", StatusCodes.INTERNAL_SERVER_ERROR);
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

        delete user.dataValues.password;
        delete user.dataValues.createdAt;
        delete user.dataValues.updatedAt;

        const jwt = Auth.createToken({id: user.id, email: user.email});
        user.dataValues.jwt = jwt;      
        return user;
    } catch(error) {
        if(error instanceof AppError) {
            throw error;
        }
        throw new AppError("Something went wrong.", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function isAuthenticated(token) {
    try {
        if(!token) {
            throw new AppError("JWT token missing.", StatusCodes.BAD_REQUEST);
        }
        const response = Auth.verifyToken(token);

        const user = await userRepository.get(response.id);
        
        if(!user) {
            throw new AppError("User not found.", StatusCodes.NOT_FOUND);
        }
        return user.id;
    } catch(error) {
        if(error instanceof AppError) throw error;

        if(error.name == "JsonWebTokenError") {
            throw new AppError("Invalid JWT token.", StatusCodes.UNAUTHORIZED);
        }

        if(error.name == "TokenExpiredError") {
            throw new AppError("JWT token expired.", StatusCodes.UNAUTHORIZED);
        }
        throw error;
    }
}

async function addRoleToUser(data) {
    try {
        const user = await userRepository.get(data.id);
        if(!user) {
            throw new AppError("No user found with the given id.", StatusCodes.BAD_REQUEST);
        }

        const role = await roleRepository.getRoleByname(data.role);
        if(!role) {
            throw new AppError("No role found", StatusCodes.BAD_REQUEST);
        }

        user.addRole(role);
        return user;
    } catch(error) {
        if(error instanceof AppError) {
            throw error;
        }
        throw new AppError("Something went wrong.", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function isAdmin(id) {
    try {
        const user = await userRepository.get(id);
        if(!user) {
            throw new AppError("No user found with the given id.", StatusCodes.BAD_REQUEST);
        }

        const role = await roleRepository.getRoleByname(Enums.USER_ROLES.ADMIN);
        if(!role) {
            throw new AppError("No role found.", StatusCodes.BAD_REQUEST);
        }

        return user.hasRole(role);
    } catch(error) {
        if(error instanceof AppError) {
            throw error;
        }
        throw new AppError("Something went wrong.", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    signup,
    signin,
    isAuthenticated,
    addRoleToUser,
    isAdmin,
}
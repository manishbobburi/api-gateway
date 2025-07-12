const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { ServerConfig } = require("../../config");
const { AppError } = require("../errors");

function checkPassword(password, encryptedPassword) {
    const isMatched = bcrypt.compareSync(password, encryptedPassword);
    return isMatched;
}

function createToken(input) {
    try {
        return jwt.sign(input, ServerConfig.JWT_SECRET, {expiresIn: ServerConfig.JWT_EXPIRY});
    } catch(error) {
        console.error(error);
        throw error;
    }
}

function verifyToken(token) {
    try {
        return jwt.verify(token, ServerConfig.JWT_SECRET);
    } catch(error) {
        throw error;
    }
}

module.exports = {
    checkPassword,
    createToken,
    verifyToken,
}
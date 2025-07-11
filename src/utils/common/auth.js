const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { ServerConfig } = require("../../config");

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

module.exports = {
    checkPassword,
    createToken,
}
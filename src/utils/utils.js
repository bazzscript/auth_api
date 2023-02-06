var jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

class AuthenticationUtils{
    // A method to generate a token
    async generateJwtToken(data){
        var token = jwt.sign(data, JWT_SECRET_KEY);
        return token;
    }

    // a method to decode the token
    async decodeJwtToken(token){
        var decoded = jwt.verify(token, JWT_SECRET_KEY);
        return decoded;
    }
}

module.exports = AuthenticationUtils;

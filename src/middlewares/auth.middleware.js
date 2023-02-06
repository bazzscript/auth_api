const { StatusCodes } = require('http-status-codes');

const AuthenticationUtils = require("../utils/utils");
const userModel = require('../models/user.models');

const authenticationUtils = new AuthenticationUtils;

class AuthMiddleware {
    async isAuthenticated(req, res, next) {
        try {
            let token;
            // Confirm, that the TOKKEN IS IN THE HEADER
            // The token wil  be placed in the authorization header and will have the Bearer prefix, thats why we need to split it and get the token
            if (
                req.headers.authorization &&
                req.headers.authorization.startsWith('Bearer')
            ) {
                token = req.headers.authorization.split(' ')[1];
            }
            // i token is empty return error
            if (!token) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    status: "error",
                    status_code: StatusCodes.BAD_REQUEST,
                    message: 'Unauthorized, Please Login and try again',
                });
            }

            // Verify and decode the token
            let decoded;
            try {
                decoded = await authenticationUtils.decodeJwtToken(token);
            } catch (error) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    status: "error",
                    status_code: StatusCodes.BAD_REQUEST,
                    message: 'Invalid/expired token',
                });
            }
            const userId = decoded.userId;
            console.log(userId);

            // Check if user with phoneNumber and userId exists
            const user = await userModel.findById(userId);
            // confirm user with phoneNumber and userId exists
            if (!user) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    status: "error",
                    status_code: StatusCodes.BAD_REQUEST,
                    message: 'User with id not found',
                });
            }

            // If user account is deactivated, return error user has been deactivated
            if (user.isAccountActive === false) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    status: "error",
                    status_code: StatusCodes.BAD_REQUEST,
                    message: "error - user has been deactivated, please contact support",
                });
            }

            // attache the user details to the req.body
            req.body.user = user;

            console.log(req.body.user);


            next();
            return;
        } catch (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: "error",
                status_code: StatusCodes.BAD_REQUEST,
                message: 'User with id not found',
            });
        }
    }
}


module.exports = AuthMiddleware;
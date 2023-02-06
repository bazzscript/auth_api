const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcrypt');

const userModel = require('../../models/user.models');
const AuthenticationUtils = require('../../utils/utils');

const authenticationUtils = new AuthenticationUtils;

class AuthController {

    //Signup
    async signUp(req, res) {
        try {

            const body = await req.body;

            // Confirm The Request.body is not empty
            if (!body) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    status: "error",
                    status_code: StatusCodes.BAD_REQUEST,
                    message: "the request body is empty"
                });
            }

            const firstName = body.first_name;
            const lastName = body.last_name;
            const email = body.email;
            const password = body.password

            // Confirmall required fields are not undefined
            if (!firstName || !lastName || !email || !password) {
                return res.status(StatusCodes.BAD_REQUEST).json(
                    {
                        status: 'error',
                        status_code: StatusCodes.BAD_REQUEST,
                        message: 'frstName, lastName, email and password are all required'
                    }
                );
            }


            // Confirm chosen email does not exist in db
            const emailExists = await userModel.findOne(
                {
                    email: email
                    // $where:{emal: email},
                },
            );
            if (emailExists) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    status: "error",
                    status_code: StatusCodes.BAD_REQUEST,
                    message: "the email already exists",
                });
            }

            // hash bassword
            const hashPassword = await bcrypt.hash(password, 10)

            // Create a new item in the inventory
            const user = await new userModel({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: hashPassword
            })

            // Save the new item in the db
            const newUser = await user.save();

            return res.status(StatusCodes.OK).json({
                status: "success",
                status_code: StatusCodes.OK,
                message: "user registered successfully, please sign in",
                data: {
                    newUser
                }
            });
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: "error",
                status_code: StatusCodes.INTERNAL_SERVER_ERROR,
                message: error.message
            });
        }
    }


    // Sign in Method
    async signIn(req, res) {
        try {
            const body = await req.body;
            // Confirm The Request.body is not empty
            if (!body) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    status: "error",
                    status_code: StatusCodes.BAD_REQUEST,
                    message: "the request body is empty"
                });
            }


            const email = body.email;
            const password = body.password

            // Confirmall required fields are not undefined
            if (!email || !password) {
                return res.status(StatusCodes.BAD_REQUEST).json(
                    {
                        status: 'error',
                        status_code: StatusCodes.BAD_REQUEST,
                        message: 'email and password are both required'
                    }
                );
            }


            // Confirm chosen email does not exist in db
            const user = await userModel.findOne(
                {
                    email: email
                    // $where:{emal: email},
                },
            );
            if (!user) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    status: "error",
                    status_code: StatusCodes.BAD_REQUEST,
                    message: "invalid credentials - email does not exist",
                });
            }

            // hash bassword
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    status: "error",
                    status_code: StatusCodes.BAD_REQUEST,
                    message: "invalid credentials - password is incorrect",
                });
            }


            const data = {
                userId: user.id,
                email: user.email,
            }
            const accessToken = await authenticationUtils.generateJwtToken(data);

            return res.status(StatusCodes.OK).json({
                status: "success",
                status_code: StatusCodes.OK,
                message: "user signed in successfully",
                data: {
                    accessToken,
                }
            });
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: "error",
                status_code: StatusCodes.INTERNAL_SERVER_ERROR,
                message: error.message
            });
        }
    }

    // Enter New Paassword
    async enterNewPassword(req, res) {

        try {
            const body = await req.body;
            // Confirm The Request.body is not empty
            if (!body) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    status: "error",
                    status_code: StatusCodes.BAD_REQUEST,
                    message: "the request body is empty"
                });
            }


            const email = body.email;
            const newPassword = body.new_password

            // Confirmall required fields are not undefined
            if (!email || !newPassword) {
                return res.status(StatusCodes.BAD_REQUEST).json(
                    {
                        status: 'error',
                        status_code: StatusCodes.BAD_REQUEST,
                        message: 'email and password are both required'
                    }
                );
            }


            // Confirm chosen email do exist in db
            const user = await userModel.findOne(
                {
                    email: email
                },
            );
            if (!user) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    status: "error",
                    status_code: StatusCodes.BAD_REQUEST,
                    message: "invalid - email does not exist",
                });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10)
      
            const filter = { email: user.email };
            const update = { password: hashedPassword };

            // enter new password
            //https://mongoosejs.com/docs/tutorials/findoneandupdate.html for more information
            const updatedUser = await userModel.findOneAndUpdate(filter, update, {
                new: true
            });


            return res.status(StatusCodes.OK).json({
                status: "success",
                status_code: StatusCodes.OK,
                message: "user password changed successfully",
                data: {
                    updatedUser,
                }
            });
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: "error",
                status_code: StatusCodes.INTERNAL_SERVER_ERROR,
                message: error.message
            });
        }
    }

    // Deactivate account Method
    deactivateAccount(req, res) { }
}

module.exports = AuthController;

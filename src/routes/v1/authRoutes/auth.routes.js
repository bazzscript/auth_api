const express = require("express");
const router = express.Router();

const AuthController = require("../../../controllers/auth_controllers/auth.controller");
const AuthMiddleware = require('../../../middlewares/auth.middleware');

const authController = new AuthController;
const authMiddleware = new AuthMiddleware;


// Create a new account
router.post("/sign_up", authController.signUp);

// Sign in to account
router.post("/sign_in", authController.signIn);

// Reset password , change uour password
router.post("/reset_password/enter_new_password", authController.enterNewPassword);

// Delete an item in the inventory
router.post("/deactivate_account", authMiddleware.isAuthenticated ,authController.deactivateAccount);



module.exports = router;
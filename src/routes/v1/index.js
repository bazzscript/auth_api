const app = require("express");
const router = app.Router();

const authRoutes = require("../v1/authRoutes/auth.routes");


router.use("/auth", authRoutes);


module.exports = router;
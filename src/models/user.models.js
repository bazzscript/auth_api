const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// the schemea is the users data satructure on mongodb
const userSchema = new Schema({

    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,

    },
    password: {
        type: String,
        required: false,
        unique : true
    },
    isAccountActive:{
        type: Boolean,
        required: false,
        default: true,
    }

});
const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
const mongoose = require('mongoose');
const crypto = require("crypto");

const userSchema = mongoose.Schema({
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
        required: true,
    },
    contact: {
        type: String,
        required: false,
    },
    location: {
        type: String,
        required: false,
    },
    profileImage: {
        type: String,
        required: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    userImageUrl: {
        type: String,
        required: false,
    },

});

const Users = mongoose.model('users', userSchema);
module.exports = Users;

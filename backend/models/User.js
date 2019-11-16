const mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    name: { trim: true, type: String, required: true },
    email: { type: String, trim: true, required: true },
    authToken: { type: String },
    verified: { type: Boolean, default: false },
    verificationToken: { type: String, trim: true },
    password: { type: String, trim: true },
    resetPasswordToken: { type: String, trim: true },
    resetPasswordExpires: { type: Date, trim: true },
    verificationExpires: { type: Date, trim: true },
});

module.exports = mongoose.model('User', UserSchema);
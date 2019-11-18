const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    name: {
    	type: String,
    	required: true
    },
    roll: String,
    email: String,
    contact: Number,
    placed: {
        type: Boolean,
        default: false
    },
    company: {
        type: String,
        default: "Not Placed"
    },
    pan: String
});

const Student = mongoose.model('Student', StudentSchema);

module.exports = Student;
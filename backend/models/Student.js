const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    name: {
    	type: String,
    	required: true
    },
    roll: String,
    branch: String,
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
    pan: String,
    cgpa: Number
});

const Student = mongoose.model('Student', StudentSchema);

module.exports = Student;
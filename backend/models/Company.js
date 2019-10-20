const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    name: String,
    address: String,
    website: String,
    type: String,
    hrname: String,
    hremail: String,
    hrmobile: String
})

const Company = mongoose.model('Company', CompanySchema);

module.exports = Company
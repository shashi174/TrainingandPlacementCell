const mongoose = require('mongoose')

const { sendEmail } = require('./emailService')
const Student = require('../models/Student')

const sendMailToPeople = (company, confirm) => {
    console.log('Sending Mail to HR', confirm)
    if(confirm == true || confirm == 'true') {
        console.log('Actually Sending Mail')
        var subject = `Confirmation of Recruitment Request`;
        var body = `
        Hello ${company.hrname}

        Your request for a Recruitment Slot at National Institute of Technology, Hamirpur for the company ${company.name} is successful.
        You may visit the campus at ${company.interviewDate}.
        
        Regards,
        Training and Placement Officer
        NIT Hamirpur`;
        sendEmail('priyamgupta2911@gmail.com', company.hremail, subject, body, '');

        console.log('Mail Sent to HR. Now sending to Students', company.hremail)

        Student.find({}).then(students => {
            console.log(students)
            students.forEach(student => {
                body = `
                Dear ${student.name},
                We are delighted to inform you that ${company.name} will be arriving on campus for recruitment on ${campus.interviewDate}.
                All students are advised to keep their Resumes and other documents ready. All the best!
                
                Regards,
                Training and Placement Officer
                NIT Hamirpur`;
                subject = `Campus Recruitment NITH: ${company.name}`;
                sendEmail('priyamgupta2911@gmail.com', student.email, subject, body, '');
                console.log('Student Mail Sent', student.email);
            })
        })
    }

    if(confirm == false || confirm == 'false') {
        console.log('Denying mail to HR')
        var subject = `Thank You for Applying to NIT Hamirpur`;
        var body = `
        Dear ${company.hrname}

        Thank you very much for your interest in the recruitment process of NIT Hamirpur.
        Unfortunately, we will not be able to accept your request for a Recruitment Slot at National Institute of Technology, Hamirpur for the company ${company.name}.
        Although we feel disappointed delivering this news to you, we would definitely encourage you to try again next year.
        
        Regards,
        Training and Placement Officer
        NIT Hamirpur`;
        sendEmail('priyamgupta2911@gmail.com', company.hremail, subject, body, '')
        console.log('Rejection Mail Sent')
    }
}

module.exports = sendMailToPeople;
// const sgMail = require('@sendgrid/mail');
// const sendMail = () => {

//     sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//     const msg = {
//     to: 'priyamgupta2911@gmail.com',
//     from: 'tst@example.com',
//     subject: 'Sending with Twilio SendGrid is Fun',
//     text: 'and easy to do anywhere, even with Node.js',
//     html: '<strong>and easy to do anywhere, even with Node.js</strong>',
//     };
//     sgMail.send(msg);
// }

// module.exports = sendMail
const nodemailer = require('nodemailer');

const {sendgridAPI} = require('../config/keys')

var creatingTransport = () => {

    var transporter = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
            user: 'apikey',
            pass: sendgridAPI
        }
    });

    return transporter;
}


module.exports = {
    sendEmail: async function(from, to, subject, text, html) {

        let transporter = creatingTransport();

        let info = await transporter.sendMail({
                from,
                to,
                subject,
                text,
                html,
            })
            .then()
            .catch(console.error());
    }
}
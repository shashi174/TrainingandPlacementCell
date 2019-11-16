const nodemailer = require('nodemailer');

var creatingTransport = () => {

    var transporter = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
            user: 'apikey',
            pass: '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'
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
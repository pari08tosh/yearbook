const nodemailer = require('nodemailer');
const mailTemplates = require('./mailTemplates');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, 
    auth: {
        user: 'paritoshthebest080797@gmail.com',
        pass: 'q2w3e4r5'
    }
});

function sendMail(options) {
    return new Promise((resolve, reject) => {
        transporter.sendMail(options, (err, info) => {
            if(err) {
                reject(err);
            }
            else {
                console.log(`Mail sent to ${options.to}`);
                resolve();
            }
         });
    });
}


module.exports.sendForgotPasswordMail = function(name, username, password, email, callback) {
    const mailOptions = {
        from: 'paritoshthebest080797@gmail.com', 
        to: email, 
        subject: 'Yearbook 2k15',
        html: mailTemplates.forgotPassword(name, username, password)
    }

    sendMail(mailOptions)
    .then(() => {
        callback();
    })
    .catch(err => {
        callback(err)
    });
}
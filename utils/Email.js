const nodemailer = require('nodemailer');
const ejs = require('ejs');

module.exports = class Email {
    constructor(user, url = 'natours.io') {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `vitprojects2020@gmail.com`;
    }

    newTransport() {
        if (process.env.NODE_ENV === 'production') {
            // Sendgrid
            return nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                    user: process.env.SENDGRID_USERNAME,
                    pass: process.env.SENDGRID_PASSWORD,
                },
            });
        }

        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    // Send the actual email
    async send(template, subject) {
        // 1) Render HTML based on a pug template
        const path = `${__dirname}` + `\\email\\${template}.ejs`;
        console.log(path);
        const html = await ejs.renderFile(path, {
            name: this.firstName,
            url: this.url,
            subject,
        });
        // 2) Define email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            //   text: htmlToText.fromString(html)
        };
        // console.log(html);
        console.log('Email sent successsfully');
        // 3) Create a transport and send email
        await this.newTransport().sendMail(mailOptions);
    }

    async sendWelcome() {
        await this.send('welcome', 'Welcome to the Natours Family!');
    }

    async sendPasswordReset() {
        await this.send(
            `passwordReset`,
            'Your password reset token (valid for only 10 minutes)'
        );
    }
};
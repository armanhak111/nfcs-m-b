const nodemailer = require('nodemailer');

class MailService { 

    constructor(){
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMPT_USER,
                pass: process.env.SMPT_PASSWORD,
            }
        })
    }

    async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from: process.env.SMPT_USER,
            to,
            subject: 'Activation' + process.env.API_URL,
            text: '',
            html: 
            `
                <div>
                    <h1>LINK ACTIVATIONS</h1>
                    <a href="${link}">${link}</a>
                </div>
            `
        })
    }
};

module.exports = new MailService();
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

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

    async sendActivationMail(to, link ,template) {
        this.transporter.use('compile', hbs({
            viewEngine: {
                extname: '.handlebars',
                layoutsDir: 'mail-templates/',
                defaultLayout: template,
            },
            viewPath: 'mail-templates',
            extName: '.handlebars',
        }));
        await this.transporter.sendMail({
            from: process.env.SMPT_USER,
            to,
            subject: 'Activation' + process.env.API_URL,
            text: '',
            template: template,
            context: {                  
                link,
                name: 'Admin'
              }
        })
    }

    async sendChangePassword(to, template) {
        this.transporter.use('compile', hbs({
            viewEngine: {
                extname: '.handlebars',
                layoutsDir: 'mail-templates/',
                defaultLayout: template,
            },
            viewPath: 'mail-templates',
            extName: '.handlebars',
        }));
        await this.transporter.sendMail({
            from: process.env.SMPT_USER,
            to,
            subject: 'Chnage Password' + process.env.API_URL,
            text: '',
            template: template,
            context: {                  
                name: 'Admin'
              }
        })
    }
};

module.exports = new MailService();
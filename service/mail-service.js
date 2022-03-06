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
        const currPath = path.join(__dirname, '../mail-templates/')
        this.transporter.use('compile', hbs({
            viewEngine: {
                extname: '.handlebars',
                layoutsDir: currPath,
                defaultLayout: template,
            },
            viewPath: currPath,
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
        const currPath = path.join(__dirname, '../mail-templates/')
        this.transporter.use('compile', hbs({
            viewEngine: {
                extname: '.handlebars',
                layoutsDir: currPath,
                defaultLayout: template,
            },
            viewPath: currPath,
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
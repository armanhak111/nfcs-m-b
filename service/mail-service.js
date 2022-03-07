const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

class MailService { 

    async sendActivationMail(to, link ,template) {
        const currPath = path.join(__dirname, '../mail-templates/')
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMPT_USER,
                pass: process.env.SMPT_PASSWORD,
            }
        })
        transporter.use('compile', hbs({
            viewEngine: {
                extname: '.handlebars',
                layoutsDir: currPath,
                defaultLayout: template,
            },
            viewPath: currPath,
            extName: '.handlebars',
        }));
        await transporter.sendMail({
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
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMPT_USER,
                pass: process.env.SMPT_PASSWORD,
            }
        })
        const currPath = path.join(__dirname, '../mail-templates/')
        transporter.use('compile', hbs({
            viewEngine: {
                extname: '.handlebars',
                layoutsDir: currPath,
                defaultLayout: template,
            },
            viewPath: currPath,
            extName: '.handlebars',
        }));
        await transporter.sendMail({
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


    
    async resetPass(to, link, template) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMPT_USER,
                pass: process.env.SMPT_PASSWORD,
            }
        })
        const currPath = path.join(__dirname, '../mail-templates/')
        transporter.use('compile', hbs({
            viewEngine: {
                extname: '.handlebars',
                layoutsDir: currPath,
                defaultLayout: template,
            },
            viewPath: currPath,
            extName: '.handlebars',
        }));
        await transporter.sendMail({
            from: process.env.SMPT_USER,
            to,
            subject: 'Reset Password' + process.env.API_URL,
            text: '',
            template: template,
            context: {                  
                link,
                name: 'Admin'
              }
        })
    }
};

module.exports = new MailService();
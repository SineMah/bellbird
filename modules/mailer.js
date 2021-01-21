'use strict';

const nodemailer = require('nodemailer');

module.exports = class Mailer {

    constructor() {

        this.transport = nodemailer.createTransport(this.getTransport());
    }

    send = async (config, data) => {

        return new Promise((resolve, reject) => {
            let options = {
                from: config.sender,
                to: config.recipient,
                subject: config.subject
            };

            if(data.html) {

                options.html = data.html;
            }

            if(data.text) {

                options.text = data.text;
            }

            if(data.files) {
                
                options.attachments = [];

                data.files.forEach(file => {
                    
                    options.attachments.push({
                        filename: file.name,
                        content: file.content,
                        encoding: file.encoding || 'base64'
                    });
                });
            }

            this.transport.sendMail(options, (error, info) => {

                if (error) {
                    
                    reject(error);
                } else {
                    
                    resolve(info);
                }
            });
        });
    }

    getTransport = () => {
        let  transport;

        switch(process.env.MAILER_TYPE) {

            case 'gmail':
                transport = this.getMail();
                break;

            case 'smtp':
                transport = this.getSmtp();
                break;

            case 'defaultSmtp':
                transport = this.getDefault
                break;
        }

        return transport;
    }

    getMail = () => {

        return {
            host: process.env.MAILER_HOST || 'smtp.gmail.com',
            port: process.env.MAILER_PORT || 465,
            secure: parseInt(process.env.MAILER_SECURE) === 1 || true,
            auth: {
                user: process.env.MAILER_USER,
                pass: process.env.MAILER_PASSWORD
            }
        };
    }

    getSmtp = () => {

        return {
            host: process.env.MAILER_HOST || '127.0.0.1',
            port: parseInt(process.env.MAILER_PORT) || 25,
            tls: {
                rejectUnauthorized: parseInt(process.env.MAILER_REJECT_UNAUTH) === 1 || false
            }
        };
    }

    getDefault = () => {

        return {
            host: process.env.MAILER_HOST,
            port: process.env.MAILER_PORT,
            auth: {
                user: process.env.MAILER_USER,
                pass: process.env.MAILER_PASSWORD
            }
        };
    }
}


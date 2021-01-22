'use strict';

const nodemailer = require('nodemailer');

module.exports = class Mailer {

    constructor() {

        this.transport = nodemailer.createTransport(this.getTransport());
    }

    send = async (data) => {

        return new Promise(async (resolve, reject) => {
            let options = {
                from: data.sender,
                to: data.recipient,
                subject: data.subject,
                headers: data.headers || []
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
                    let fileOptions = {
                        filename: file.name,
                        content: file.content
                    };

                    if(file.cid) {

                        fileOptions.cid = file.cid;
                    }

                    if (file.encoding) {

                        fileOptions.encoding = file.encoding;
                    }

                    options.attachments.push(fileOptions);
                });
            }

            try {
                
                resolve(await this.transport.sendMail(options));
            }catch(e) {

                reject(e);
            }
            
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
                transport = this.getDefault();
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


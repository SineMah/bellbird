'use strict';

const DIRECTORY_SEPERATOR = require('path').sep;
const real_path = require('path').resolve;
const Render = require('../modules/render');
const render = new Render();
const Validate = require('../modules/validate');
const validator = new Validate();
const Mailer = require('../modules/mailer');
const mailer = new Mailer();

module.exports = async (app) => {

    await validator.loadConfig();

    const p = (req, validateTemplate = 'mail-preview') => {
        let payload, 
            error = true,
            status = 500;

        try {

            payload = req.body || JSON.parse(params.payload) || {};
        }catch (e) {

            payload = {};
        }

        if(validator.proof(validateTemplate, payload)) {

            error = false;
            status = 200;
        }

        return {
            error: error,
            status: status,
            payload: payload,
            errors: validator.getErrors()
        };
    }

    const r = async (payload) => {
        let response = null;

        if(payload.template) {

            response = await render.raw(payload.template, payload.data);
        }

        if(!response && payload.file) {

            if(payload.file.indexOf('.twig') < 0) {

                payload.file = `${payload.file}.twig`;
            }

            response = await render.file(payload.file, payload.data);
        }

        return response;
    }

    const response = async (data) => {
        let resp = await r(data.payload);

        if(data.error) {

            resp = data.errors;
        }

        return resp;
    }

    app.get('/', (req, res) => {
        const path = [
            __dirname,
            '..',
            'version.json'
        ].join(DIRECTORY_SEPERATOR);

        res.sendFile(real_path(path))
    });

    app.post('/send', async (req, res) => {
        const data = p(req, 'mail-template');
        const html = await response(data);

        let error = false, 
            status = 200, 
            errors = [];

        /**
         * validation failed
         * html is array
         */
        if(Array.isArray(html)) {

            status = 500;
            error = true;
            errors = html;
        }else {

            data.payload.html = html;

            try {
                mailer.send(data.payload);
    
            }catch (e) {
    
            }
        }

        res.status(status).send({
            error: error,
            payload: errors
        });
    });

    app.post('/render/preview', async (req, res) => {
        const data = p(req);

        res.status(data.status).send(await response(data));
    });
};
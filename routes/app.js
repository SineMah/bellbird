'use strict';

const Render = require('../modules/render');
const render = new Render();
const Validate = require('../modules/validate');
const validator = new Validate();

module.exports = async (app) => {

    await validator.loadConfig();

    const p = (req) => {
        let payload, 
            error = true,
            status = 500;

        try {

            payload = req.body || JSON.parse(params.payload) || {};
        }catch (e) {

            payload = {};
        }

        if(validator.proof('mail-preview', payload)) {

            error = false;
            status = 200;
        }

        return {
            error: error,
            status: status,
            payload: payload,
            errors: validator.getErrors(),
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

    app.get('/', (req, res) => res.send({yo: 1}));

    app.post('/send', async (req, res) => {
        const renderData = {};

        res.send(await render('./dashboard.twig', renderData));
    });

    app.post('/render/preview', async (req, res) => {
        const data = p(req);

        res.status(data.status).send(await response(data));
    });
};
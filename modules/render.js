'use strict';

const Juice = require('../render/juice');
const Mjml = require('../render/mjml');
const Inky = require('../render/inky');
const Plain = require('../render/plain');
const DIRECTORY_SEPERATOR = require('path').sep;
const twig = require('twig');

module.exports = class Render {

    constructor(renderer = []) {

        this.subrenders = renderer;
    }

    file = async (file, data = {}) => {
    
        return new Promise((resolve, reject) => {
            const filePath = [__dirname, '..', 'templates', file].join(DIRECTORY_SEPERATOR);
    
            twig.renderFile(filePath, data, async (err, preparedHtml) => {
                const html = await this.subrender(preparedHtml);

                if(err || html.errors) {

                    reject(err || html.errors);
                }else {

                    resolve(html.html);
                }
            });
        });
    }

    raw = async (template, data) => {

        return new Promise(async (resolve, reject) => {
            const templ = twig.twig({data: template});
            const preparedHtml = templ.render(data);
            const html = await this.subrender(preparedHtml);

            if(html.errors) {

                reject(html.errors);
            }else {

                resolve(html.html);
            }
        });
    }

    subrender = async (html) => {

        let rendered = html,
            _r;

        for(const renderer of this.subrenders) {

            switch(renderer) {

                case 'juice':
                    _r = new Juice(rendered);
                    rendered = await _r.getHtml();
                    break;

                case 'mjml':
                    _r = new Mjml(rendered);
                    rendered = await _r.getHtml();
                    break;

                case 'inky':
                    _r = new Inky(rendered);
                    rendered = await _r.getHtml();
                    break;
                
                default:
                    _r = new Plain(rendered);
            }
        }

        return {html: rendered, errors: _r.getErrors()};
    }

    getSubrender = (payload) => {
        let renderers = [];

        const useJuice = payload.useJuice || true;

        if(payload.useInky) {

            renderers.push('inky');
        }

        if(payload.useMjml) {
            
            renderers.push('mjml');
        }

        if(useJuice) {
            
            renderers.push('juice');
        }

        return renderers;
    }
}
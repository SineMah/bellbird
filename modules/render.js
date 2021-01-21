'use strict';

const DIRECTORY_SEPERATOR = require('path').sep;
const twig = require('twig');

module.exports = class Render {

    constructor() {

    }

    file = async (file, data = {}) => {
    
        return new Promise((resolve) => {
            const filePath = [__dirname, '..', 'templates', file].join(DIRECTORY_SEPERATOR);
    
            twig.renderFile(filePath, data, (err, html) => {
    
                resolve(html || '');
            });
        });
    }

    raw = async (template, data) => {

        const templ = twig.twig({data: template});

        return templ.render(data);
    }

}
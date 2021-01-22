'use strict';

const Plain = require('./plain');
const InkyInstance = require('inky').Inky;
const cheerio = require('cheerio');

module.exports = class Inky extends Plain {

    constructor(source, options = {}) {

        super(source);

        this.inky = new InkyInstance(options);
    }

    getHtml = async () => {

        this.render();

        return this.html;
    }

    render = () => {
        const html = cheerio.load(this.source);
        const convertedHtml = this.inky.releaseTheKraken(html);

        this.html = convertedHtml;
    }
}


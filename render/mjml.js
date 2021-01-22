'use strict';

const Plain = require('./plain');
const mjml2html = require('mjml');

module.exports = class Mjml extends Plain {

    constructor(source, options = {}) {

        super(source);

        this.options = options;
    }

    getHtml = async () => {

        this.render();

        return this.html;
    }

    render = () => {
        const response = mjml2html(this.source, this.options);

        this.errors = response.errors;

        this.html = response.html;
    }
}


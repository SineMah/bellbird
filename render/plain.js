'use strict';

module.exports = class Inky {

    constructor(source) {

        this.source = source;
        this.html = '';
        this.errors = null;
    }

    getHtml = async () => {

        this.errors = null;

        return this.source;
    }

    getErrors = () => {

        return this.errors;
    }

    getSource = () => {

        return this.source;
    }
}

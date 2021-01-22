'use strict';

const Plain = require('./plain');
const juice = require('juice');

module.exports = class Juice extends Plain {

    constructor(source, options = {}) {

        super(source);

        this.options = options;
    }

    getHtml = async () => {

        this.render();

        return this.html;
    }

    render = () => {

        try {

            this.html = juice(this.source, this.options);
        }catch(e) {

            this.errors = e;
        }
        
    }
}


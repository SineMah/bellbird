'use strict';

const Ajv = require('ajv').default;
const fs = require('fs').promises;
const DIRECTORY_SEPERATOR = require('path').sep;


module.exports = class Validate {

    constructor() {

        this.ajv = new Ajv({ allErrors: true, removeAdditional:'all' });
        this.errors = null;

        require('ajv-formats')(this.ajv);
    }

    addSchema = (name, schema) => {
        this.ajv.addSchema(schema, name);
    };

    proof = (name, data) => {

        this.errors = null;
        
        const valid = this.ajv.validate(name, data);

        this.errors = this.ajv.errors;

        return valid;
    };

    getErrors = () => {

        return this.errors;
    };

    loadConfig = async () => {
        const json = await fs.readFile(
            ['.', 'config', 'validate.json'].join(DIRECTORY_SEPERATOR),
            'utf8'
        );
        const config = JSON.parse(json);

        config.forEach((conf) => {

            this.addSchema(conf.name, conf.schema);
        });
    };
}
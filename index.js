'use strict';

require('dotenv').config();

// const { v4: uuidv4 } = require('uuid');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const Validate = require('./modules/validate');
const port = process.env.PORT || 56707;

(async () => {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));

    app.set('twig options', {
        allow_async: true, // Allow asynchronous compiling
        strict_variables: false
    });

    require('./routes/app')(app);

    app.listen(port, () => console.log(`Listen at ${port}`));
})();
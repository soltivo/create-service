const express = require('express');
const app = express();

const environment = require('./helpers/environment');
environment.load().then(function() {
    // Init AWS config
    const AWS = require("aws-sdk");
    const region = process.env.AWS_REGION || 'us-east-1';
    const config = new AWS.Config({
        accessKeyId: global['AWS'].AWS_ACCESS_KEY_ID,
        secretAccessKey: global['AWS'].AWS_SECRET_ACCESS_KEY,
        region: region
    });
    AWS.config.update(config);
    
    const router = require('./routes/index');
    app.use(router);
});

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // parse requests of content-type: application/x-www-form-urlencoded

const port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log('Server Started on port ' + port + ' at ' + new Date());
});

var express = require('express');
// const validation = require('../helpers/validation');
var router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
global.secret = {};

// On ECS, we pass an .env file with the secret so we need to process the .env file 
if (process.env.secret) {
    secret = JSON.parse(process.env.secret);
    global.secret = secret;
    require('./CHANGE THAT')(router,validation);
}
// On local we need to use the secret manager
else{
    var AWS = require('aws-sdk'),
    region = "CHANGE THAT",
    secretName = "CHANGE THAT",
    secret,
    decodedBinarySecret;

    // // Create a Secrets Manager client
    var client = new AWS.SecretsManager({
        region: region,
    });
    
    client.getSecretValue({SecretId: secretName}, function(err, data) {
        // console.log(err);
        if (err) {
            console.log(err);
            if (err.code === 'DecryptionFailureException')
                // Secrets Manager can't decrypt the protected secret text using the provided KMS key.
                throw err;
            else if (err.code === 'InternalServiceErrorException')
                // An error occurred on the server side.
                throw err;
            else if (err.code === 'InvalidParameterException')
                // You provided an invalid value for a parameter.
                throw err;
            else if (err.code === 'InvalidRequestException')
                // You provided a parameter value that is not valid for the current state of the resource.
                throw err;
            else if (err.code === 'ResourceNotFoundException')
                // We can't find the resource that you asked for.
                throw err;
        }
        else {
            
            // Decrypts secret using the associated KMS CMK.
            // Depending on whether the secret is a string or binary, one of these fields will be populated.
            if ('SecretString' in data) {
                secret = JSON.parse(data.SecretString);
                secret.accessKeyId = secret['CHANGE THAT']
                secret.secretAccessKey = secret['CHANGE THAT']
                secret.region = "CHANGE THAT";
                global.secret = secret;
            } else {
                let buff = new Buffer(data.SecretBinary, 'base64');
                decodedBinarySecret = buff.toString('ascii');
            }
            // routes 
            require('./CHANGE THAT')(router,validation);
        }
    });
}
module.exports.router = router;
const AWS = require('aws-sdk');
const region = process.env.AWS_REGION || 'us-east-1';

let loadSecrets = async (secretName, id) => {
    // Create a Secrets Manager client
    const client = new AWS.SecretsManager({
        region: region
    });

    // Add key if not present
    if(!global[id]) {
        global[id] = {};
    }
    
    // Check if already loaded
    if(global[id] && global[id].secrets) {
        return global[id].secrets;
    }

    let secrets;
    await client.getSecretValue({ SecretId: secretName }).promise()
        .then(function (data) {
            if ('SecretString' in data) {
                secrets = data.SecretString;
            } else {
                let buff = new Buffer(data.SecretBinary, 'base64');
                secrets = buff.toString('ascii');
            }
        })
        .catch(function (err) {
            throw err;
        });

    global[id].secrets = JSON.parse(secrets);
    return global[id].secrets;
}

module.exports = { loadSecrets }

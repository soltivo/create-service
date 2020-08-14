var AWS = require('aws-sdk');
var region = 'us-east-1';

let loadSecrets = async (secretName, id) => {
    // Create a Secrets Manager client
    var client = new AWS.SecretsManager({
        region: region
    });

    if(!global.environment.secrets) {
        global.environment.secrets = [];
    }

    if(global.environment.secrets[id]) {
        return global.environment.secrets[id];
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

    global.environment.secrets[id] = JSON.parse(secrets);
    return global.environment.secrets[id];
}

module.exports = { loadSecrets }

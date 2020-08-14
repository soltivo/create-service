let load = async (environment) => {
    // Load .env file if exists
    require('dotenv').config();

    if (process.env.environemnt) {
        // On ECS, we pass an .env file with the secret so we need to process the .env file 
        global.environemnt = JSON.parse(process.env.environemnt);

    } else {

        if(!global.environment) {
            global.environment = {};
            global.environment.secrets = [];
        }

        if(!environment || environment == 'local') {
            global.environment.name = 'local';
            global.environment.region = 'local.region';
            global.environment.secrets['AWS'] = {
                AWS_ACCESS_KEY_ID: 'access-key-id',
                AWS_SECRET_ACCESS_KEY: 'secret-access-key',
                API_LINK: 'http://localhost:3000'
            };
            
        } else if(environment = 'QA') {
            global.environment.name = 'QA'
            const secretsManager = require('./secretsManager');
            await secretsManager.loadSecrets('dev/keys', 'AWS');
        }
    }
}

module.exports = { load }
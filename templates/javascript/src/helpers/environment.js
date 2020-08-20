exports.load = async () => {
    // Load .env file if exists
    require('dotenv').config();

    const region = process.env.AWS_REGION || 'us-east-1';
    global.AWS = {};
    global.STRIPE = {};

    // On ECS, secrets are set in the container environment from the SecretsManager
    if (this.isStageEnvironment()) {
        const errors = [];
        if(!process.env.aws_secret) {
            errors.push('AWS secrets not found in environment (aws_secret)');
        }
        if(!process.env.stripe_secret) {
            errors.push('Stripe secrets not found in environemnt (stripe_secret)');
        }
        if(errors.length != 0) {
            throw new Error(errors);
        }

        // Set global variables
        const aws_secrets = JSON.parse(process.env.aws_secret);
        global.AWS.region = region;
        global.AWS.secrets = aws_secrets;
        
        const stripe_secrets = JSON.parse(process.env.stripe_secret);
        global.STRIPE.secrets = stripe_secrets;

    } else {

        // On local we use dummy or need to use the Secrets Manager
        if(this.isLocalEnvironment()) {
            global.AWS.region = 'local.region';
            global.AWS.secrets = {
                AWS_ACCESS_KEY_ID: 'access-key-id',
                AWS_SECRET_ACCESS_KEY: 'secret-access-key',
                API_LINK: 'http://localhost:3000'
            };
            global.STRIPE.secrets = {
                STRIPE_SECRET_KEY: 'secret_key',
                STRIPE_PUBLIC_KEY: 'public_key',
                STRIPE_CLIENT_ID: 'client_id'
            }
            
        // If it is wanted to run local with stage environment
        } else if(this.isStageEnvironment()) {
            const secretsManager = require('./secretsManager');
            await secretsManager.loadSecrets('dev/keys', 'AWS');
            await secretsManager.loadSecrets('dev/stripe', 'STRIPE');
            global.AWS.region = region;
        }
    }
}

exports.isLocalEnvironment = () => {
    return !process.env.ENVIRONMENT || process.env.ENVIRONMENT == 'local';
}
// To run locally with AWS services
exports.isStageEnvironment = () => {
    return process.env.ENVIRONMENT == 'stage';
}
exports.isProdEnvironment = () => {
    return process.env.ENVIRONMENT == 'prod';
}
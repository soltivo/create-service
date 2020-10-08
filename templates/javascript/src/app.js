const express = require('express');
const app = express();
const cors = require('cors');

const environment = require('./helpers/environment');
environment
	.load()
	.then(function () {
		// Init AWS config
		const AWS = require('aws-sdk');

		const config = new AWS.Config({
			accessKeyId: global.AWS.secrets.AWS_ACCESS_KEY_ID,
			secretAccessKey: global.AWS.secrets.AWS_SECRET_ACCESS_KEY,
			region: global.AWS.region,
		});
		AWS.config.update(config);

		app.use(
			cors({
				origin: '*',
				credentials: true,
				exposedHeaders: ['Origin, X-Requested-With, Content-Type, Accept'],
			}),
		);

		var { router } = require('./routes/index');
		app.use(router);
	})
	.catch((error) => {
		console.error(error);
	});

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // parse requests of content-type: application/x-www-form-urlencoded

// Make sure unhandled Rejections are logged
process.on('unhandledRejection', (reason, promise) => {
	console.log('Unhandled Rejection at:', reason.stack || reason);
	// Recommended: send the information to cloudwatch
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
	console.log('Server Started on port ' + port + ' at ' + new Date());
});
